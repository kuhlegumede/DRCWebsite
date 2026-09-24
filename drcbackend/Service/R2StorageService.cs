using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace drcbackend.Service
{
    public class R2StorageService : IR2StorageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly R2Settings _settings;
        private readonly ILogger<R2StorageService> _logger;

        private static readonly string[] AllowedExtensions =
        {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        };

        private const long MaxFileSize = 5 * 1024 * 1024;

        public R2StorageService(
            IOptions<R2Settings> options,
            ILogger<R2StorageService> logger)
        {
            _logger = logger;
            _settings = options.Value;

            if (string.IsNullOrWhiteSpace(_settings.AccountId))
                throw new InvalidOperationException(
                    "Cloudflare R2 AccountId is missing.");

            if (string.IsNullOrWhiteSpace(_settings.AccessKeyId))
                throw new InvalidOperationException(
                    "Cloudflare R2 AccessKeyId is missing.");

            if (string.IsNullOrWhiteSpace(_settings.SecretAccessKey))
                throw new InvalidOperationException(
                    "Cloudflare R2 SecretAccessKey is missing.");

            if (string.IsNullOrWhiteSpace(_settings.BucketName))
                throw new InvalidOperationException(
                    "Cloudflare R2 BucketName is missing.");

            if (string.IsNullOrWhiteSpace(_settings.PublicUrl))
                throw new InvalidOperationException(
                    "Cloudflare R2 PublicUrl is missing.");

            var accountValue = _settings.AccountId.Trim();

            accountValue = accountValue
                .Replace(
                    "https://",
                    "",
                    StringComparison.OrdinalIgnoreCase)
                .Replace(
                    "http://",
                    "",
                    StringComparison.OrdinalIgnoreCase)
                .Trim()
                .TrimEnd('/');

            string serviceUrl;

            if (accountValue.EndsWith(
                ".r2.cloudflarestorage.com",
                StringComparison.OrdinalIgnoreCase))
            {
                serviceUrl = $"https://{accountValue}";
            }
            else
            {
                serviceUrl =
                    $"https://{accountValue}.r2.cloudflarestorage.com";
            }

            _logger.LogInformation(
                "R2 ServiceURL being used: {ServiceUrl}",
                serviceUrl);

            var config = new AmazonS3Config
            {
                ServiceURL = serviceUrl,
                AuthenticationRegion = "auto",
                ForcePathStyle = true,
                RequestChecksumCalculation = RequestChecksumCalculation.WHEN_REQUIRED,
                ResponseChecksumValidation = ResponseChecksumValidation.WHEN_REQUIRED
            };

            _s3Client = new AmazonS3Client(
                _settings.AccessKeyId.Trim(),
                _settings.SecretAccessKey.Trim(),
                config);
        }

        public async Task<string> UploadAsync(
            IFormFile file,
            string folder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException(
                    "The uploaded file is empty.");

            if (file.Length > MaxFileSize)
                throw new ArgumentException(
                    "Image must not be larger than 5 MB.");

            var extension =
                Path.GetExtension(file.FileName)
                    .ToLowerInvariant();

            if (!AllowedExtensions.Contains(extension))
                throw new ArgumentException(
                    "Only JPG, JPEG, PNG and WEBP images are allowed.");

            var fileName =
                $"{Guid.NewGuid():N}{extension}";

            var objectKey =
                $"{folder.Trim('/')}/{fileName}";

            try
            {
                await using var stream = file.OpenReadStream();

                var request = new PutObjectRequest
                {
                    BucketName = _settings.BucketName,
                    Key = objectKey,
                    InputStream = stream,
                    ContentType = GetContentType(extension),
                    UseChunkEncoding = false,
                    DisablePayloadSigning = true
                };

                _logger.LogInformation(
                    "Uploading image to R2. Bucket={Bucket}, Key={Key}",
                    _settings.BucketName,
                    objectKey);

                await _s3Client.PutObjectAsync(request);

                var publicUrl =
                    $"{_settings.PublicUrl.TrimEnd('/')}/{objectKey}";

                _logger.LogInformation(
                    "R2 upload successful. URL={Url}",
                    publicUrl);

                return publicUrl;
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Cloudflare R2 upload failed. " +
                    "ErrorCode={ErrorCode}, " +
                    "StatusCode={StatusCode}, " +
                    "Message={Message}",
                    ex.ErrorCode,
                    ex.StatusCode,
                    ex.Message);

                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Unexpected error while uploading image to R2.");

                throw;
            }
        }

        public async Task DeleteAsync(string imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
                return;

            var publicUrl =
                _settings.PublicUrl.TrimEnd('/');

            if (!imageUrl.StartsWith(
                publicUrl,
                StringComparison.OrdinalIgnoreCase))
            {
                return;
            }

            var objectKey =
                imageUrl
                    .Substring(publicUrl.Length)
                    .TrimStart('/');

            if (string.IsNullOrWhiteSpace(objectKey))
                return;

            try
            {
                var request = new DeleteObjectRequest
                {
                    BucketName = _settings.BucketName,
                    Key = objectKey
                };

                _logger.LogInformation(
                    "Deleting R2 object. Bucket={Bucket}, Key={Key}",
                    _settings.BucketName,
                    objectKey);

                await _s3Client.DeleteObjectAsync(request);

                _logger.LogInformation(
                    "R2 object deleted successfully. Key={Key}",
                    objectKey);
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Cloudflare R2 delete failed. " +
                    "ErrorCode={ErrorCode}, " +
                    "StatusCode={StatusCode}, " +
                    "Message={Message}",
                    ex.ErrorCode,
                    ex.StatusCode,
                    ex.Message);

                throw;
            }
        }

        private static string GetContentType(
            string extension)
        {
            return extension switch
            {
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            };
        }
    }
}