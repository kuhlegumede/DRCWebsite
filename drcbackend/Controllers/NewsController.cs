using drcbackend.Filters;
using drcbackend.Models;
using drcbackend.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace drcbackend.Controllers
{
    [ApiController]
    [Route("api/news")]
    public class NewsController : ControllerBase
    {
        private readonly INewsRepository _repository;
        private readonly IWebHostEnvironment _environment;

        private static readonly string[] AllowedExtensions =
        {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        };

        private const long MaxFileSize = 5 * 1024 * 1024;

        public NewsController(
            INewsRepository repository,
            IWebHostEnvironment environment)
        {
            _repository = repository;
            _environment = environment;
        }

        // =========================================================
        // GET ALL NEWS
        // =========================================================

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<NewsPostDto>>> GetNews()
        {
            var news = await _repository.GetAllAsync();

            var result = news
                .Select(ToDto)
                .ToList();

            return Ok(result);
        }

        // =========================================================
        // GET NEWS BY ID
        // =========================================================

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<NewsPostDto>> GetNewsById(int id)
        {
            var news = await _repository.GetByIdAsync(id);

            if (news == null)
            {
                return NotFound(new
                {
                    message = "News update not found."
                });
            }

            return Ok(ToDto(news));
        }

        // =========================================================
        // CREATE NEWS
        // =========================================================

        [HttpPost]
        [AdminOnly]
        [RequestSizeLimit(30 * 1024 * 1024)]
        public async Task<ActionResult<NewsPostDto>> CreateNews(
            [FromForm] string title,
            [FromForm] string content,
            [FromForm] List<IFormFile>? images)
        {
            if (string.IsNullOrWhiteSpace(title))
            {
                return BadRequest(new
                {
                    message = "Please enter a title."
                });
            }

            if (string.IsNullOrWhiteSpace(content))
            {
                return BadRequest(new
                {
                    message = "Please enter the update."
                });
            }

            if (title.Length > 200)
            {
                return BadRequest(new
                {
                    message = "The title is too long."
                });
            }

            if (content.Length > 10000)
            {
                return BadRequest(new
                {
                    message = "The update is too long."
                });
            }

            var news = new NewsPost
            {
                Title = title.Trim(),
                Content = content.Trim(),
                PublishedAtUtc = DateTime.UtcNow,
                CreatedAtUtc = DateTime.UtcNow
            };

            // =====================================================
            // IMAGE UPLOAD
            // =====================================================

            if (images != null && images.Count > 0)
            {
                var rootPath = _environment.WebRootPath;

                if (string.IsNullOrWhiteSpace(rootPath))
                {
                    rootPath = Path.Combine(
                        _environment.ContentRootPath,
                        "wwwroot"
                    );
                }

                var uploadDirectory = Path.Combine(
                    rootPath,
                    "uploads",
                    "news"
                );

                Directory.CreateDirectory(uploadDirectory);

                foreach (var image in images)
                {
                    if (image == null || image.Length == 0)
                    {
                        continue;
                    }

                    if (image.Length > MaxFileSize)
                    {
                        return BadRequest(new
                        {
                            message =
                                $"Image '{image.FileName}' is larger than 5 MB."
                        });
                    }

                    var extension =
                        Path.GetExtension(image.FileName)
                            .ToLowerInvariant();

                    if (!AllowedExtensions.Contains(extension))
                    {
                        return BadRequest(new
                        {
                            message =
                                $"Image '{image.FileName}' has an unsupported format. " +
                                "Use JPG, JPEG, PNG or WEBP."
                        });
                    }

                    var fileName =
                        $"{Guid.NewGuid():N}{extension}";

                    var filePath =
                        Path.Combine(
                            uploadDirectory,
                            fileName
                        );

                    await using var stream =
                        new FileStream(
                            filePath,
                            FileMode.CreateNew
                        );

                    await image.CopyToAsync(stream);

                    news.Images.Add(new NewsImage
                    {
                        ImageUrl =
                            $"/uploads/news/{fileName}",

                        Caption =
                            Path.GetFileNameWithoutExtension(
                                image.FileName
                            )
                    });
                }
            }

            // =====================================================
            // SAVE NEWS
            // =====================================================

            await _repository.CreateAsync(news);

            return Ok(ToDto(news));
        }

        // =========================================================
        // DELETE NEWS
        // =========================================================

        [HttpDelete("{id:int}")]
        [AdminOnly]
        public async Task<IActionResult> DeleteNews(int id)
        {
            var news = await _repository.GetByIdAsync(id);

            if (news == null)
            {
                return NotFound(new
                {
                    message = "News update not found."
                });
            }

            foreach (var image in news.Images)
            {
                if (string.IsNullOrWhiteSpace(image.ImageUrl))
                {
                    continue;
                }

                var relativePath =
                    image.ImageUrl
                        .TrimStart('/')
                        .Replace(
                            '/',
                            Path.DirectorySeparatorChar
                        );

                var rootPath = _environment.WebRootPath;

                if (string.IsNullOrWhiteSpace(rootPath))
                {
                    rootPath = Path.Combine(
                        _environment.ContentRootPath,
                        "wwwroot"
                    );
                }

                var filePath =
                    Path.Combine(
                        rootPath,
                        relativePath
                    );

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            await _repository.DeleteAsync(news);

            return NoContent();
        }

        // =========================================================
        // DTO
        // =========================================================

        private static NewsPostDto ToDto(NewsPost news)
        {
            return new NewsPostDto
            {
                Id = news.Id,
                Title = news.Title,
                Content = news.Content,
                PublishedAtUtc = news.PublishedAtUtc,
                CreatedAtUtc = news.CreatedAtUtc,

                Images = news.Images
                    .Select(image => new NewsImageDto
                    {
                        Id = image.Id,
                        ImageUrl = image.ImageUrl,
                        Caption = image.Caption
                    })
                    .ToList()
            };
        }
    }
}
