using Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http;


var builder = WebApplication.CreateBuilder(args);
// Preuzmi Google JWKS za Firebase (potpisni ključevi)
var jwksJson = await new HttpClient()
    .GetStringAsync("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com");
var jwks = new JsonWebKeySet(jwksJson);
var firebaseSigningKeys = jwks.Keys; // IEnumerable<SecurityKey>


// =====================
// Services
// =====================

// EF Core (SQLite)
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("Default")));

// Controllers
builder.Services.AddControllers();

// Swagger + Bearer auth u Swaggeru
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Booker API", Version = "v1" });

    // ✅ ispravno: HTTP bearer shema (ne ApiKey)
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",        // <-- mala slova!
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});
// CORS – dodaj URL(ove) tvog frontenda
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("frontend", p => p
        .WithOrigins("http://localhost:5173", "http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

// Firebase JWT auth
var firebaseProjectId = builder.Configuration["Firebase:ProjectId"];
var authority = $"https://securetoken.google.com/{firebaseProjectId}";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = authority; // https://securetoken.google.com/{projectId}
        options.TokenValidationParameters = new()
        {
            ValidIssuer = authority,
            ValidAudience = firebaseProjectId,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,

            // ⬇️ KLJUČNO: reci validatoru koje ključeve da koristi
            IssuerSigningKeyResolver = (token, securityToken, kid, validationParameters) => firebaseSigningKeys
        };

        // (opcionalno) lakši debug ako nešto ne valja:
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = ctx =>
            {
                Console.WriteLine("JWT auth failed: " + ctx.Exception.Message);
                if (ctx.Exception.InnerException != null)
                    Console.WriteLine("Inner: " + ctx.Exception.InnerException.Message);
                return Task.CompletedTask;
            }
        };
    });


builder.Services.AddAuthorization();

// =====================
// Build
// =====================
var app = builder.Build();

// DB migrate + seed (DEV)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    if (app.Environment.IsDevelopment())
        await DataSeeder.SeedAsync(db);
}

// =====================
// Middleware pipeline
// =====================
app.UseCors("frontend");

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
