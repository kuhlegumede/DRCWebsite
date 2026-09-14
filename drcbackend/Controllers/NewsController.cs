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
        // GET ALL NEWS - PUBLIC
        // =========================================================
     [HttpGet]
[AllowAnonymous]
 public async Task<IActionResult> GetNews()
{
    try
    {
        var news = await _repository.GetAllAsync();

        var result = news
            .OrderByDescending(n => n.PublishedAtUtc)
            .Select(ToDto)
            .ToList();

        return Ok(result);
    }
    catch (Exception ex)
    {
        return StatusCode(
            StatusCodes.Status500InternalServerError,
            new
            {
                message = "Failed to load news.",
                error = ex.Message,
                innerError = ex.InnerException?.Message
            }
        );
    }
}

        // =========================================================
        // GET NEWS BY ID - PUBLIC
        // =========================================================
         [HttpGet("{id:int}")]
[AllowAnonymous]
public async Task<IActionResult> GetNewsById(int id)
{
    try
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
    catch (Exception ex)
    {
        return StatusCode(
            StatusCodes.Status500InternalServerError,
            new
            {
                message = "Failed to load the news update.",
                error = ex.Message,
                innerError = ex.InnerException?.Message
            }
        );
    }
}

        // =========================================================
        // CREATE NEWS - ADMIN ONLY
        // =========================================================
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
                // -------------------------------------------------
                // VALIDATION
                // -------------------------------------------------

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

                // -------------------------------------------------
                // CREATE NEWS POST
                // -------------------------------------------------

                var news = new NewsPost
                {
                    Title = title.Trim(),
                    Content = content.Trim(),
                    PublishedAtUtc = DateTime.UtcNow,
                    CreatedAtUtc = DateTime.UtcNow
                };

                // -------------------------------------------------
                // ENSURE UPLOAD DIRECTORY EXISTS
                // -------------------------------------------------

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

                // -------------------------------------------------
                // PROCESS IMAGES
                // -------------------------------------------------

                if (images != null)
                {
                    foreach (var image in images)
                    {
                        if (image == null || image.Length == 0)
                        {
                            continue;
                        }

                        // Maximum 5 MB per image
                        if (image.Length > MaxFileSize)
                        {
                            return BadRequest(new
                            {
                                message =
                                    $"Image '{image.FileName}' is larger than 5 MB."
                            });
                        }

                        // Check file extension
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

                        // Generate safe unique filename
                        var fileName =
                            $"{Guid.NewGuid():N}{extension}";

                        var filePath =
                            Path.Combine(
                                uploadDirectory,
                                fileName
                            );

                        // Save image
                        await using var stream =
                            new FileStream(
                                filePath,
                                FileMode.Create
                            );

                        await image.CopyToAsync(stream);

                        // Add image to news post
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

                // -------------------------------------------------
                // SAVE TO DATABASE
                // -------------------------------------------------

                await _repository.CreateAsync(news);

                // IMPORTANT:
                // Do NOT return the EF entity directly.
                // The NewsPost -> Images -> NewsPost relationship
                // creates a JSON serialization cycle.
                return Ok(ToDto(news));
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message =
                            "An error occurred while creating the news post.",

                        error = ex.Message,

                        innerError =
                            ex.InnerException?.Message
                    }
                );
            }
        }

        // =========================================================
        // DELETE NEWS - ADMIN ONLY
        // =========================================================
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

            // -----------------------------------------------------
            // DELETE ASSOCIATED IMAGE FILES
            // -----------------------------------------------------

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

            // -----------------------------------------------------
            // DELETE DATABASE RECORD
            // -----------------------------------------------------

            await _repository.DeleteAsync(news);

            return NoContent();
        }

        // =========================================================
        // EF ENTITY -> SAFE API DTO
        // =========================================================
        //
        // This prevents:
        //
        // NewsPost
        //    -> Images
        //       -> NewsPost
        //          -> Images
        //             -> NewsPost
        //
        // from causing a System.Text.Json object cycle.
        // =========================================================

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
}
