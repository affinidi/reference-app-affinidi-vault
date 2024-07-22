using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;


namespace Affinidi_Login_Demo_App;

public class Startup
    {

        public IWebHostEnvironment Environment {get; }
        public IConfiguration Configuration {get; }

        public Startup(IWebHostEnvironment environment, IConfiguration config) {
            Environment = environment;
            Configuration = config;
            DotNetEnv.Env.Load();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseStaticFiles();

            app.UseEndpoints(endpoints => {
                endpoints.MapRazorPages();
            });
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Prevent WS-Federation claim names being written to tokens
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            
            services.AddAuthentication(options => {
                
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options => {
                
                // Use the strongest setting in production, which also enables HTTP on developer workstations
                options.Cookie.SameSite = SameSiteMode.Lax;
            })
            .AddOpenIdConnect(options => {

                // Use the same settings for temporary cookies
                options.NonceCookie.SameSite = SameSiteMode.Lax;
                options.CorrelationCookie.SameSite = SameSiteMode.Lax;
                options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                
                // Set the main OpenID Connect settings
                options.Authority = System.Environment.GetEnvironmentVariable("PROVIDER_ISSUER");
                options.ClientId = System.Environment.GetEnvironmentVariable("PROVIDER_CLIENT_ID");
                options.ClientSecret = System.Environment.GetEnvironmentVariable("PROVIDER_CLIENT_SECRET");
                string scopeString = System.Environment.GetEnvironmentVariable("SCOPE");
                options.ResponseType = OpenIdConnectResponseType.Code;
                options.ResponseMode = OpenIdConnectResponseMode.Query;
                options.Scope.Clear();
                scopeString?.Split(" ", StringSplitOptions.TrimEntries).ToList().ForEach(scope => {
                    options.Scope.Add(scope);
                });

                // If required, override the issuer and audience used to validate ID tokens
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = options.Authority,
                    ValidAudience = options.ClientId
                };

                // This example gets user information for display from the user info endpoint
                options.GetClaimsFromUserInfoEndpoint = true;

                // // Handle the post logout redirect URI
                // options.Events.OnRedirectToIdentityProviderForSignOut = (context) =>
                // {
                //     context.ProtocolMessage.PostLogoutRedirectUri = Configuration.GetValue<string>("OpenIdConnect:PostLogoutRedirectUri");
                //     return Task.CompletedTask;
                // };
                
                // Save tokens issued to encrypted cookies
                options.SaveTokens = true;

                // Set this in developer setups if the OpenID Provider uses plain HTTP
                options.RequireHttpsMetadata = false;

                /* Uncomment to debug HTTP requests from the web backend to the Identity Server
                   Run a tool such as MITM proxy to view the request and response messages
                /*options.BackchannelHttpHandler = new HttpClientHandler()
                {
                    Proxy = new WebProxy("http://127.0.0.1:8888"),
                    UseProxy = true,
                };*/
            });

            services.AddAuthorization();
            services.AddRazorPages();

            // Add this app's types to dependency injection
            services.AddSingleton<TokenClient>();
        }
    }
