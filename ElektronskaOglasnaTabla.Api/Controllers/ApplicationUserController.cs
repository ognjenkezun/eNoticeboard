using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElektronskaOglasnaTabla.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using ElektronskaOglasnaTabla.Api.Interfaces;
using ElektronskaOglasnaTabla.Api.Services;

namespace ElektronskaOglasnaTabla.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationUserController : ControllerBase
    {
        private readonly ElektronskaOglasnaTablaContext _context;
        private UserManager<ApplicationUser> _userManager;
        private SignInManager<ApplicationUser> _signInManager;
        private RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationSettings _appSettings;
        private readonly ILogger _logger;
        private readonly IEmailSender _emailSender;

        public ApplicationUserController(ElektronskaOglasnaTablaContext context,
                                            UserManager<ApplicationUser> userManager, 
                                            SignInManager<ApplicationUser> signInManger,
                                            RoleManager<IdentityRole> roleManager, 
                                            IOptions<ApplicationSettings> appSettings, 
                                            ILogger<IdentityUser> logger, 
                                            IEmailSender emailSender)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManger;
            _appSettings = appSettings.Value;
            _emailSender = emailSender;
        }

        //[HttpGet]
        //public ActionResult<IEnumerable<ApplicationUser>> GetUsers()
        //{
        //    return _userManager.Users.ToList();
        //}

        // GET : /api/ApplicationUser
        [HttpGet]
        [Route("Users")]
        public ActionResult<IEnumerable<ApplicationUser>> GetAllUsers()
        {
            var listOfUsers = _userManager.Users.ToList();

            var usersResultList = new List<ApplicationUser>();

            listOfUsers.ForEach(user =>
            {
                var res = new ApplicationUser();

                res.Id = user.Id;
                res.FirstName = user.FirstName;
                res.LastName = user.LastName;
                res.Email = user.Email;

                usersResultList.Add(res);
            });

            return usersResultList;
        }

        // GET : /api/ApplicationUser/1
        [HttpGet("{id}")]
        [Authorize]
        public ActionResult<ApplicationUser> GetUser(string id)
        {
            return _userManager.Users.FirstOrDefault(user => user.Id == id);
        }

        // DELETE : /api/ApplicationUser/1
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<ApplicationUser>> DeleteUser(string id)
        {
            var userInitiatorId = HttpContext.User.Claims.Where(c => c.Type == "userId").FirstOrDefault().Value;
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return BadRequest(new { message = "User not found." });
            }
            else if (userInitiatorId != id)
            {
                var result = await _userManager.DeleteAsync(user);

                if (result.Succeeded)
                {
                    return user;
                }

                return BadRequest(new { message = "Error " + result.Errors });
            }

            return BadRequest(new { message = "You can't delete your account."});
        }

        // PUT : /api/ApplicationUser
        [HttpPut]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<ApplicationUserModel>> EditUser(ApplicationUserModel model)
        {
            var user = await _userManager.FindByIdAsync(model.Id);
            var roles = await _userManager.GetRolesAsync(user);
            if (user == null)
            {
                return BadRequest(new { message = "User not found." });
            }
            else
            {
                user.Email = model.Email;
                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.UserName = model.Email;
                //user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, model.PasswordHash);
                try
                {
                    var result = await _userManager.UpdateAsync(user);

                    await _userManager.RemoveFromRolesAsync(user, roles);
                    await _userManager.AddToRoleAsync(user, model.Role);

                    if (result.Succeeded)
                    {
                        return model;
                    }

                    return BadRequest(new { message = "Error " + result.Errors });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = "Error " + ex });
                    throw ex;
                }
            }
        }

        // PUT : /api/ApplicationUser/editYourselfProfile
        [HttpPut("editYourselfProfile")]
        [Authorize]
        public async Task<ActionResult<ApplicationUser>> EditYourselfProfile(ApplicationUser model)
        {
            var userId = HttpContext.User.Claims.Where(c => c.Type == "userId").FirstOrDefault().Value;
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return BadRequest(new { message = "User not found." });
            }
            else
            {
                user.Email = model.Email;
                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.UserName = model.Email;
                //user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, model.PasswordHash);
                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    return Ok(result);
                }

                return BadRequest(new { message = "Error " + result.Errors });
            }
        }

        // POST : /api/ApplicationUser/Register
        [HttpPost]
        [Route("Register")]
        public async Task<Object> PostApplicationUser(ApplicationUserModel model)
        {
            model.Role = model.Role ?? "Employee";
            var applicationUser = new ApplicationUser()
            {
                UserName = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email
            };

            try
            {
                var result = await _userManager.CreateAsync(applicationUser, model.Password);
                await _userManager.AddToRoleAsync(applicationUser, model.Role);

                if (result.Succeeded)
                {
                    return Ok(result);
                }

                return BadRequest(new { message = "Error " + result.Errors });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error " + ex });
                throw ex;
            }
        }

        [HttpPost]
        [Route("Login")]
        // POST : /api/ApplicationUser/Login
        public async Task<IActionResult> Login(LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            _logger.LogInformation("SASdadadadasdadasdasssssssssssssss");
            _logger.LogInformation("User ", user);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                //Get role assigned to the user
                var role = await _userManager.GetRolesAsync(user);
                IdentityOptions _options = new IdentityOptions();

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("userId", user.Id.ToString()),
                        new Claim(_options.ClaimsIdentity.RoleClaimType, role.FirstOrDefault())
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                var userRole = role.FirstOrDefault();

                return Ok(new { token, userRole, user.UserName });
            }
            else
            {
                return BadRequest(new { message = "Username or password is incorrect." });
            }
        }

        // POST : /api/ApplicationUser/Logout
        [HttpPost]
        [Route("Logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            return Ok();
        }

        // GET : /api/ApplicationUser/getUserProfile
        [HttpGet("getUserProfile")]
        [Authorize]
        public async Task<ApplicationUserModel> GetUserProfile()
        {
            var userId = HttpContext.User.Claims.Where(c => c.Type == "userId").FirstOrDefault().Value;
            var user = await _userManager.FindByIdAsync(userId);
            var userRole = await _userManager.GetRolesAsync(user);

            var userData = new ApplicationUserModel
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                UserName = user.UserName,
                Role = userRole.FirstOrDefault(),
            };

            return userData;
        }

        // GET : /api/ApplicationUser/numberOfUsers
        [HttpGet]
        [Route("numberOfUsers")]
        [Authorize(Roles = "Administrator")]
        public ActionResult<int> GetNumberOfUsers()
        {
            return _userManager.Users.Count();
        }

        // GET: api/ApplicationUser/userDetailsPerPage/1&5
        [HttpGet("userDetailsPerPage/{page}&{pageSize}")]
        [Authorize(Roles = "Administrator")]
        public IEnumerable<ApplicationUserModel> GetUserDetailsPerPage(int page, int pageSize)
        {
            var users = _userManager.Users.Skip((page - 1) * pageSize)
                                             .Take(pageSize)
                                             .ToList();

            var usersResultList = new List<ApplicationUserModel>();

            users.ForEach(user =>
            {
                var userRoleIds = _context.UserRoles.Where(x => x.UserId == user.Id)
                                                    .Select(y => y.RoleId).ToList();

                var roles = _context.Roles.Where(x => userRoleIds.Contains(x.Id)).ToList();

                roles.ForEach(role =>
                {
                    //var res = new ApplicationUserModel();
                    var res = new ApplicationUserModel
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        //var listOfRoles = _userManager.GetRolesAsync(user);
                        Role = role.Name,
                    };

                    usersResultList.Add(res);
                });
            });
            //var listOfRoles = await _userManager.GetRolesAsync(users[0]).GetAwaiter();
            //var listOfRoles = _userManager.GetRolesAsync(users[0]);

            return usersResultList;
        }

        // POST: api/ApplicationUser/changePassword
        [HttpPost("changePassword")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordModel model)
        {
            var listErrorMessages = new List<string>();
            var userId = HttpContext.User.Claims.Where(c => c.Type == "userId").FirstOrDefault().Value;
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return BadRequest(new { message = "User is not logged in." });
            }

            var result = await _userManager.ChangePasswordAsync(user,
                model.CurrentPassword, model.ConfirmNewPassword);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    listErrorMessages.Add(error.Description);
                }

                return BadRequest(new { messages = listErrorMessages });
            }

            //var loginModel = new LoginModel();
            //loginModel.UserName = user.UserName;
            //loginModel.Password = user.PasswordHash;

            //await Login(loginModel);
            //await _signInManager.RefreshSignInAsync(user);

            return Ok();
        }

        // POST: api/ApplicationUser/changeUserPassword
        [HttpPost("changeUserPassword")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> ChangeUserPassword(ChangePasswordUserModel model)
        {
            var listErrorMessages = new List<string>();
            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user == null)
            {
                return BadRequest(new { message = "User is not logged in." });
            }

            var result = await _userManager.ChangePasswordAsync(user,
                model.CurrentPassword, model.ConfirmNewPassword);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    listErrorMessages.Add(error.Description);
                }

                return BadRequest(new { messages = listErrorMessages });
            }

            //var loginModel = new LoginModel();
            //loginModel.UserName = user.UserName;
            //loginModel.Password = user.PasswordHash;

            //await Login(loginModel);
            //await _signInManager.RefreshSignInAsync(user);

            return Ok();
        }

        // POST: api/ApplicationUser/changePassword
        //[HttpPost("changePassword")]
        //[Authorize]
        //public async Task<IActionResult> ChangePassword(ChangePasswordUserModel model)
        //{
        //    var listErrorMessages = new List<string>();
        //    var userId = HttpContext.User.Claims.Where(c => c.Type == "userId").FirstOrDefault().Value;
        //    var user = await _userManager.FindByIdAsync(userId);

        //    if (user == null)
        //    {
        //        return BadRequest(new { message = "User is not logged in." });
        //    }

        //    var result = await _userManager.ChangePasswordAsync(user,
        //        model.CurrentPassword, model.ConfirmNewPassword);

        //    if (!result.Succeeded)
        //    {
        //        foreach (var error in result.Errors)
        //        {
        //            listErrorMessages.Add(error.Description);
        //        }

        //        return BadRequest(new { messages = listErrorMessages });
        //    }

        //    var loginModel = new LoginModel();
        //    loginModel.UserName = user.UserName;
        //    loginModel.Password = user.PasswordHash;

        //    //await Login(loginModel);
        //    //await _signInManager.RefreshSignInAsync(user);

        //    return Ok();
        //}

        // POST: api/ApplicationUser/adminResetUserPassword
        [HttpPost("adminResetUserPassword")]
        public async Task<IActionResult> AdminResetUserPassword(ResetPasswordModel resetPasswordModel)
        {
            return null;
        }

        // GET : api/ApplicationUser/getLinkForResetPassword
        [HttpPost("getLinkForResetPassword")]
        public async Task<IActionResult> GetLinkForResetPassword(ForgotPasswordModel forgotPasswordModel)
        {
            var user = await _userManager.FindByEmailAsync(forgotPasswordModel.Email);

            if (user == null)
            {
                return BadRequest(new { message = "User not exist!" });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var content = "reset-password?token=" + Uri.EscapeDataString(token) + "&email=" + user.Email;
            var link = Uri.EscapeDataString(token);

            return Ok(new { content });
        }

        // POST: api/ApplicationUser/resetPassword
        [HttpPost("resetPassword")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordModel resetPasswordModel)
        {
            var listErrorMessages = new List<string>();

            var user = await _userManager.FindByEmailAsync(resetPasswordModel.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Korisnik sa unesenom e-mail adresom ne postoji." });
            }

            var resetPasswordResult = await _userManager.ResetPasswordAsync(user,
                resetPasswordModel.Token, resetPasswordModel.Password);
            if (!resetPasswordResult.Succeeded)
            {
                foreach (var error in resetPasswordResult.Errors)
                {
                    listErrorMessages.Add(error.Description);
                }

                return BadRequest(new { messages = listErrorMessages });
            }

            return Ok();
        }

        // POST: api/ApplicationUser/forgotPassword
        [HttpPost("forgotPassword")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordModel forgotPasswordModel)
        {
            var user = await _userManager.FindByEmailAsync(forgotPasswordModel.Email);

            if (user == null)
            {
                return BadRequest(new { message = "User not exist!" });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var content = Request.Scheme + "://localhost:4200/reset-password?token=" + Uri.EscapeDataString(token) + "&email=" + user.Email;
            //var callback = Url.Action(nameof(ResetPassword), "ApplicationUser", new { token, email = user.Email }, Request.Scheme);

            var message = new EmailMessage(new string[] { user.Email }, "Reset password token", content);
            await _emailSender.SendEmailAsync(message);

            return Ok();
        }
    }
}