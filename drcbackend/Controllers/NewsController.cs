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

        // PUBLIC
        // GET: /api/news
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetNews()
        {
            var news = await _repository.GetAllAsync();

            return Ok(news);
        }

        // PUBLIC
        // GET: /api/news/5
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetNewsById(int id)
        {
            var news = await _repository.GetByIdAsync(id);

            if (news == null)
            {
                return NotFound(new
                {
                    message = "News update not found."
                });
            }

            return Ok(news);
        }

        // ADMIN ONLY
        // POST: /api/news
          [HttpPost]
[Authorize]
[RequestSizeLimit(30 * 1024 * 1024)]
public async Task<IActionResult> CreateNews(
    [FromForm] string title,
    [FromForm] string content,
    [FromForm] List<IFormFile>? images)
{
    try
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

        // Only create upload directory when images exist
        if (images != null && images.Count > 0)
        {
            var webRoot = _environment.WebRootPath;

            if (string.IsNullOrWhiteSpace(webRoot))
            {
                webRoot = Path.Combine(
                    _environment.ContentRootPath,
                    "wwwroot"
                );
            }

            var uploadDirectory = Path.Combine(
                webRoot,
                "uploads",
                "news"
            );

            Directory.CreateDirectory(uploadDirectory);

            foreach (var image in images)
            {
                if (image == null || image.Length == 0)
                    continue;

                if (image.Length > MaxFileSize)
                {
                    return BadRequest(new
                    {
                        message = $"Image '{image.FileName}' is larger than 5 MB."
                    });
                }

                var extension = Path.GetExtension(image.FileName)
                    .ToLowerInvariant();

                if (!AllowedExtensions.Contains(extension))
                {
                    return BadRequest(new
                    {
                        message =
                            $"Image '{image.FileName}' has an unsupported format."
                    });
                }

                var fileName = $"{Guid.NewGuid():N}{extension}";

                var filePath = Path.Combine(
                    uploadDirectory,
                    fileName
                );

                await using var stream = new FileStream(
                    filePath,
                    FileMode.Create
                );

                await image.CopyToAsync(stream);

                news.Images.Add(new NewsImage
                {
                    ImageUrl = $"/uploads/news/{fileName}",
                    Caption = Path.GetFileNameWithoutExtension(
                        image.FileName
                    )
                });
            }
        }

        await _repository.CreateAsync(news);

        return Ok(news);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new
        {
            message = "News creation failed.",
            error = ex.Message,
            innerError = ex.InnerException?.Message
        });
    }
}
        // ADMIN ONLY
        // DELETE: /api/news/5
        [HttpDelete("{id:int}")]
        [Authorize]
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

            // Delete physical image files
            foreach (var image in news.Images)
            {
                if (string.IsNullOrWhiteSpace(image.ImageUrl))
                    continue;

                var relativePath = image.ImageUrl
                    .TrimStart('/')
                    .Replace(
                        '/',
                        Path.DirectorySeparatorChar
                    );

                var filePath = Path.Combine(
                    _environment.WebRootPath ?? Path.Combine(
                        _environment.ContentRootPath,
                        "wwwroot"
                    ),
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
    }
}
