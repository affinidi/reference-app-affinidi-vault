using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Affinidi_Login_Demo_App
{
    public class LogoutModel : PageModel
    {

        /* Unmerged change from project 'Affinidi-Login-Demo-App'
        Before:
                public void OnGet()
        After:
                public async Task OnGetAsync()
        */
        public bool loggedOut = false;
        public async Task  OnGetAsync()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            loggedOut = true;
        }
    }
}
