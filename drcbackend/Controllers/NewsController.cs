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

        // PUBLIC
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetNews()
        {
            var news = await _repository.GetAllAsync();

            var result = news .Select(ToDto) .ToList();
            return Ok(result);
        }

        // PUBLIC
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

            return Ok(ToDto(news));
        }

        // ADMIN ONLY
        [HttpPost]
        [AdminOnly]
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

                // Ensure root path falls back safely on Azure App Service
                var rootPath = _environment.WebRootPath;

                if (string.IsNullOrEmpty(rootPath))
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

                if (images != null)
                {
                    foreach (var image in images)
                    {
                        if (image.Length == 0)
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
                                    $"Image '{image.FileName}' has an unsupported format. Use JPG, JPEG, PNG or WEBP."
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
                                FileMode.Create
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

                await _repository.CreateAsync(news);

                // IMPORTANT:
                // Do not return the EF entity directly.
                // Convert it to a DTO to prevent JSON navigation-property cycles.
                return Ok(ToDto(news));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message =
                        "An error occurred while creating the news post.",

                    error = ex.Message,

                    innerError =
                        ex.InnerException?.Message
                });
            }
        }

        // ADMIN ONLY
        [HttpDelete("{id:int}")]
        [AdminOnly]
        public async Task<IActionResult> DeleteNews(int id)
        {
            var news =
                await _repository.GetByIdAsync(id);

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

                var filePath =
                    Path.Combine(
                        _environment.WebRootPath
                            ?? Path.Combine(
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

        // Converts EF entity -> safe API DTO
        private static NewsPostDto ToDto(NewsPost news)
        {
            return new NewsPostDto
            {
                Id = news.Id,

                Title = news.Title,

                Content = news.Content,

                PublishedAtUtc =
                    news.PublishedAtUtc,

                CreatedAtUtc =
                    news.CreatedAtUtc,

                Images = news.Images
                    .Select(image => new NewsImageDto
                    {
                        Id = image.Id,

                        ImageUrl =
                            image.ImageUrl,

                        Caption =
                            image.Caption
                    })
                    .ToList()
            };
        }
    }
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
