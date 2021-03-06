﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElektronskaOglasnaTabla.Domain.Models;
using Microsoft.AspNetCore.Identity;
using ElektronskaOglasnaTabla.Domain.CustomModels;
using Microsoft.AspNetCore.Authorization;
using ElektronskaOglasnaTabla.Api.Interfaces;

namespace ElektronskaOglasnaTabla.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ElektronskaOglasnaTablaContext _context;
        private UserManager<ApplicationUser> _userManager;
        private SignInManager<Users> _signInManager;
        private readonly IEmailSender _emailSender;

        /*public UserController(ElektronskaOglasnaTablaContext context, UserManager<Users> userManager, SignInManager<Users> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }
        */
        public UserController(ElektronskaOglasnaTablaContext context, UserManager<ApplicationUser> userManager, IEmailSender emailSender)
        {
            _context = context;
            _userManager = userManager;
            _emailSender = emailSender;
        }

        // GET: api/User
        [HttpGet]
        //[Authorize(Roles = "Administrator")]
        public ActionResult<IEnumerable<Users>> GetUsers()
        {
            var users = _userManager.Users.ToList();

            var resultList = new List<Users>();

            users.ForEach(item =>
            {
                var user = new Users();

                //user.UserId = item.Id;
                user.UserFirstName = item.FirstName;
                user.UserLastName = item.LastName;
                user.UserEmail = item.Email;

                resultList.Add(user);
            });

            return resultList;
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        //[Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Users>> GetUsers(int id)
        {
            var users = await _context.Users.FindAsync(id);

            if (users == null)
            {
                return NotFound();
            }

            return users;
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PutUsers(int id, Users users)
        {
            if (id != users.UserId)
            {
                return BadRequest();
            }

            _context.Entry(users).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsersExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/User
        [HttpPost]
        //[Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Users>> PostUsers(Users users)
        {
            _context.Users.Add(users);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUsers", new { id = users.UserId }, users);
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        //[Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Users>> DeleteUsers(int id)
        {
            var users = await _context.Users.FindAsync(id);
            if (users == null)
            {
                return NotFound();
            }

            _context.Users.Remove(users);
            await _context.SaveChangesAsync();

            return users;
        }

        private bool UsersExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }

        /*[HttpPost]
        [Route("Register")]
        //POST: /api/ElektronskaOglasnaTabla/Register
        public async Task<Object> PostUser(Users model)
        {
            var user = new Users()
            {
            };

            try
            {
                var result = await _userManager.CreateAsync(user, model.UserPassword);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }*/

        // GET: api/User/UsersDetails
        [HttpGet("UsersDetails")]
        //[Authorize(Roles = "Administrator")]
        public ActionResult<IEnumerable<UserDetails>> GetUsersDetails()
        {
            var userList = _context.Users.ToList();

            var result = new List<UserDetails>();

            userList.ForEach(user => {
                var resultItem = new UserDetails();

                //User
                resultItem.UserId = user.UserId;
                resultItem.UserFirstName = user.UserFirstName;
                resultItem.UserLastName = user.UserLastName;
                resultItem.UserEmail = user.UserEmail;

                //User type
                resultItem.UserTypeId = user.UserTypeId;
                var userTypeItem = _context.UserTypes.FirstOrDefault(x => x.UserTypeId == user.UserTypeId);
                resultItem.UserTypeName = userTypeItem.UserTypeName;

                result.Add(resultItem);
            });

            return result;
        }
    }
}
