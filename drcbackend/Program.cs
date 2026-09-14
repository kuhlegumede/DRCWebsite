using drcbackend.Repository;
using drcbackend.Service;
using DrcPrimarySchool.Api.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Server.IIS;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = 30 * 1024 * 1024;
});

// DATABASE
var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "DefaultConnection is missing from appsettings.json."
    );
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString)
);

// REPOSITORIES
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<INewsRepository, NewsRepository>();

// SERVICES
builder.Services.AddSingleton<IPasswordHasher, Pbkdf2PasswordHasher>();
builder.Services.AddSingleton<ITokenService, TokenService>();
builder.Services.AddSingleton<IAdminAuthService, AdminAuthService>();
builder.Services.AddScoped<EmailService>();

// CONTROLLERS
builder.Services.AddControllers();
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme = "AdminScheme";
        options.DefaultAuthenticateScheme = "AdminScheme";
        options.DefaultChallengeScheme = "AdminScheme";
        options.DefaultForbidScheme = "AdminScheme";
    })
    .AddScheme<AuthenticationSchemeOptions, AdminAuthenticationHandler>(
        "AdminScheme",
        options => { }
    );

builder.Services.AddAuthorization();

builder.Services.Configure<SmtpSettings>(
    builder.Configuration.GetSection("SmtpSettings")
);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "https://drcprimaryschool.co.za",
                "https://www.drcprimaryschool.co.za"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// SWAGGER
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "DRC Primary School API",
            Version = "v1",
            Description =
                "Backend API for the DRC Primary School website."
        }
    );

    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "Session Token",
            In = ParameterLocation.Header,
            Description =
                "Enter your admin token as: Bearer YOUR_TOKEN"
        }
    );

    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        }
    );
});

var app = builder.Build();

// Apply any pending EF Core migrations automatically on startup.
// This ensures tables like NewsPosts/NewsImages exist in production
// even if `dotnet ef database update` was never run against Azure SQL.

// Ensure wwwroot exists before serving static files.
// This is important for uploaded News images on Azure App Service.
var webRootPath = app.Environment.WebRootPath;

if (string.IsNullOrWhiteSpace(webRootPath))
{
    webRootPath = Path.Combine(
        app.Environment.ContentRootPath,
        "wwwroot"
    );
}

Directory.CreateDirectory(webRootPath);

Directory.CreateDirectory(
    Path.Combine(webRootPath, "uploads", "news")
);

app.UseStaticFiles();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();

app.UseAuthorization();

app.MapGet("/", () => Results.Ok(new
{
    name = "DRC Primary School API",
    status = "running",
    environment = app.Environment.EnvironmentName
}));

app.MapControllers();

app.Run();
