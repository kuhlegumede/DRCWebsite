using drcbackend.Repository;
using drcbackend.Service;
using DrcPrimarySchool.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

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

// SERVICES

builder.Services.AddSingleton<IPasswordHasher, Pbkdf2PasswordHasher>();

builder.Services.AddSingleton<ITokenService, TokenService>();

builder.Services.AddSingleton<IAdminAuthService, AdminAuthService>();

builder.Services.AddScoped<EmailService>();

// CONTROLLERS

builder.Services.AddControllers();
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));

// CORS

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173",
                "http://localhost:5174",
                "https://localhost:5174"
                "https://drc-primary-school-api-hjddghe3hpd2cvgf.southafricanorth-01.azurewebsites.net"
            )
            .AllowAnyHeader();
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
            Description = "Backend API for the DRC Primary School website."
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

// PASSWORD HASH UTILITY

if (
    args.Length == 2 &&
    args[0].Equals(
        "hash-password",
        StringComparison.OrdinalIgnoreCase
    )
)
{
    var hasher = new Pbkdf2PasswordHasher();

    Console.WriteLine();
    Console.WriteLine("Generated password hash:");
    Console.WriteLine();
    Console.WriteLine(hasher.Hash(args[1]));
    Console.WriteLine();

    return;
}

// SWAGGER

    app.UseSwagger();

    app.UseSwaggerUI();

// HTTP PIPELINE

/*if(!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}*/

app.UseCors("AllowFrontend");

app.MapGet("/", () => Results.Ok(new
{
    name = "DRC Primary School API",
    status = "running",
    environment = app.Environment.EnvironmentName
}));

app.MapControllers();

app.Run();
