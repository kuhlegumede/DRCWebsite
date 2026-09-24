using drcbackend.Filters;
using drcbackend.Models;
using drcbackend.Repository;
using drcbackend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace drcbackend.Controllers
{
    [ApiController]
    [Route("api/news")]
    public class NewsController : ControllerBase
    {
        private readonly INewsRepository _repository;
        private readonly IR2StorageService _storageService;

        public NewsController(
            INewsRepository repository,
            IR2StorageService storageService)
        {
            _repository = repository;
            _storageService = storageService;
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
        public async Task<ActionResult<NewsPostDto>> GetNewsById(
            int id)
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
            // IMAGE UPLOAD TO CLOUDFLARE R2
            // =====================================================

            if (images != null && images.Count > 0)
            {
                foreach (var image in images)
                {
                    if (image == null || image.Length == 0)
                    {
                        continue;
                    }

                    try
                    {
                        var imageUrl =
                            await _storageService.UploadAsync(
                                image,
                                "news"
                            );

                        news.Images.Add(new NewsImage
                        {
                            ImageUrl = imageUrl,

                            Caption =
                                Path.GetFileNameWithoutExtension(
                                    image.FileName
                                )
                        });
                    }
                    catch (ArgumentException ex)
                    {
                        return BadRequest(new
                        {
                            message = ex.Message
                        });
                    }
                }
            }

            // =====================================================
            // SAVE NEWS TO DATABASE
            // =====================================================

            await _repository.CreateAsync(news);

            return Ok(ToDto(news));
        }

        // =========================================================
        // DELETE NEWS
        // =========================================================

        [HttpDelete("{id:int}")]
        [AdminOnly]
        public async Task<IActionResult> DeleteNews(
            int id)
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

            // Delete images from Cloudflare R2
            foreach (var image in news.Images)
            {
                if (string.IsNullOrWhiteSpace(image.ImageUrl))
                {
                    continue;
                }

                try
                {
                    await _storageService.DeleteAsync(
                        image.ImageUrl
                    );
                }
                catch
                {
                    // Do not prevent database deletion
                    // if an R2 image is already missing.
                }
            }

            await _repository.DeleteAsync(news);

            return NoContent();
        }

        // =========================================================
        // DTO
        // =========================================================

        private static NewsPostDto ToDto(
            NewsPost news)
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