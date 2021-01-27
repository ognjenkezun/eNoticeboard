using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElektronskaOglasnaTabla.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ElektronskaOglasnaTabla.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        public UserProfileController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize(Roles = "Administrator, Radnik")]
        //GET : /api/UserProfile
        public async Task<Object> GetUserProfile()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            var user = await _userManager.FindByIdAsync(userId);
            return new
            {
                user.FirstName,
                user.LastName,
                user.Email,
                user.UserName
            };
        }

        [HttpGet]
        [Authorize(Roles = "Administrator")]
        [Route("ForAdmin")]
        public string getForAdmin()
        {
            return "Web method for Administrator";
        }

        [HttpGet]
        [Authorize(Roles = "Employee")]
        [Route("ForEmployee")]
        public string getForEmployee()
        {
            return "Web method for Employee";
        }

        [HttpGet]
        [Authorize(Roles = "Administrator, Radnik")]
        [Route("ForAdminOrEmployee")]
        public string getForAdminOrEmployee()
        {
            return "Web method for Admin or Employee";
        }
    }
}