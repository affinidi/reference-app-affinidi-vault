using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;


namespace Affinidi_Login_Demo_App
{
    public record UserData(string given_name, string family_name, string email, string did);
    [Authorize]
    public class UserDetailModel(TokenClient tokenClient) : PageModel
    {
        public string? Username { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public string? DID {get;set;}
        public string? Email {get;set;}
        UserData userData=new UserData(default,default,default,default);


        private readonly TokenClient tokenClient = tokenClient;

        public async Task OnGet()
        {
            ClaimsPrincipal user = this.User;
            List<string> claims= user.FindAll("Custom").Select(x=>x.Value).ToList();
            foreach(var claim in claims)
            {
                 var dataDict = JsonConvert.DeserializeObject<Dictionary<string, string>>(claim);
                 userData= userData with
                 {
                    given_name=dataDict?.GetValueOrDefault("givenName",userData.given_name),
                    family_name=dataDict?.GetValueOrDefault("familyName",userData.family_name),
                    email=dataDict?.GetValueOrDefault("email",userData.email),
                    did= dataDict?.GetValueOrDefault("did",userData.did)
                 };
            }
            
            // var givenName = user.FindFirstValue("given_name");
            // var familyName = user.FindFirstValue("family_name");
            this.Username = userData.given_name + " " + userData.family_name;
            this.DID=userData.did;
            this.Email=userData.email;
            this.AccessToken = await this.tokenClient.GetAccessToken(this.HttpContext);
            this.RefreshToken = await this.tokenClient.GetRefreshToken(this.HttpContext);
        }

        public async Task<IActionResult> OnPostRefreshToken()
        {
            await this.tokenClient.RefreshAccessToken(this.HttpContext);
            this.AccessToken = await this.tokenClient.GetAccessToken(this.HttpContext);
            this.RefreshToken = await this.tokenClient.GetRefreshToken(this.HttpContext);
            return Page();
        }

        public async Task OnPostLogout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            //await HttpContext.SignOutAsync(OpenIdConnectDefaults.AuthenticationScheme);
        }
    }
}
