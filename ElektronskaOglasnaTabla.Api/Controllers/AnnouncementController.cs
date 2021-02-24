using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElektronskaOglasnaTabla.Domain.Models;
using ElektronskaOglasnaTabla.Domain.CustomModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace ElektronskaOglasnaTabla.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementController : ControllerBase
    {
        private readonly ElektronskaOglasnaTablaContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger _logger;

        public AnnouncementController(ElektronskaOglasnaTablaContext context, UserManager<ApplicationUser> userManager, ILogger<Announcements> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        // GET: api/Announcement
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Announcements>>> GetAnnouncements()
        {
            return await _context.Announcements.ToListAsync();
        }

        // GET: api/Announcement/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Announcements>> GetAnnouncements(int id)
        {
            var announcements = await _context.Announcements.FindAsync(id);

            if (announcements == null)
            {
                return NotFound();
            }
            _logger.LogInformation("User ====> {0}", HttpContext.User.Claims.Where(c => c.Type == ClaimsIdentity.DefaultRoleClaimType).FirstOrDefault().Value);
            //_logger.LogInformation("Content of HTTP request header is ====> {0}", HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", ""));

            return announcements;
        }

        // PUT: api/Announcement/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator, Radnik")]
        public async Task<IActionResult> PutAnnouncements(int id, Announcements announcement)
        {
            var userId = HttpContext.User.Claims.Where(c => c.Type == "userId").FirstOrDefault().Value;
            var userRole = HttpContext.User.Claims.Where(c => c.Type == ClaimsIdentity.DefaultRoleClaimType).FirstOrDefault().Value;

            if (id != announcement.AnnouncementId)
            {
                return BadRequest();
            }

            var updatedAnnouncement = new AnnouncementDetails();

            if (announcement.UserCreatedId == userId || userRole == "Administrator")
            {
                announcement.UserModifiedId = userId;
                announcement.AnnouncementDateModified = DateTime.Now;
                announcement.AnnouncementShow = true;
                announcement.AnnouncementExpiryDate.AddHours(DateTime.Now.Hour + 1);
                announcement.AnnouncementExpiryDate.AddMinutes(DateTime.Now.Minute);
                announcement.AnnouncementExpiryDate.AddSeconds(DateTime.Now.Second);
                _context.Entry(announcement).State = EntityState.Modified;

                updatedAnnouncement.AnnouncementId = announcement.AnnouncementId;
                updatedAnnouncement.AnnouncementTitle = announcement.AnnouncementTitle;
                updatedAnnouncement.AnnouncementDescription = announcement.AnnouncementDescription;
                updatedAnnouncement.AnnouncementDateCreated = announcement.AnnouncementDateCreated;
                updatedAnnouncement.AnnouncementDateModified = announcement.AnnouncementDateModified;
                updatedAnnouncement.AnnouncementExpiryDate = announcement.AnnouncementExpiryDate;
                updatedAnnouncement.ImportantIndicator = announcement.AnnouncementImportantIndicator;
                updatedAnnouncement.CategoryId = announcement.CategoryId;
                var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == announcement.CategoryId);
                updatedAnnouncement.CategoryName = categ.CategoryName;
                updatedAnnouncement.PriorityId = categ.PriorityId;
                var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
                updatedAnnouncement.PriorityValue = prior.PriorityValue;
                updatedAnnouncement.UserCreatedId = announcement.UserCreatedId;
                var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == announcement.UserCreatedId);
                updatedAnnouncement.UserCreatedFirstName = userCreated.FirstName;
                updatedAnnouncement.UserCreatedLastName = userCreated.LastName;
                if (announcement.UserModifiedId != null)
                {
                    updatedAnnouncement.UserModifiedId = announcement.UserModifiedId;
                    var userModified = _userManager.Users.FirstOrDefault(user => user.Id == announcement.UserModifiedId);
                    updatedAnnouncement.UserModifiedFirstName = userModified.FirstName;
                    updatedAnnouncement.UserModifiedLastName = userModified.LastName;
                }
                var files = _context.Files.Where(x => x.AnnouncementId == announcement.AnnouncementId)
                                          .ToList();
                files.ForEach(file =>
                {
                    updatedAnnouncement.Files.Add(file);
                });

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AnnouncementsExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            else
            {
                return Unauthorized();
            }

            return Ok(new { updatedAnnouncement });
        }

        // POST: api/Announcement
        [HttpPost]
        [Authorize(Roles = "Administrator, Radnik")]
        public async Task<ActionResult<Announcements>> PostAnnouncements(Announcements announcement)
        {
            //DODATI USERA KOJI JE POSTAVIO IZ TOKENA
            var userId = HttpContext.User.Claims.Where(c => c.Type == "userId").FirstOrDefault().Value;
            announcement.UserCreatedId = userId;
            announcement.AnnouncementDateCreated = DateTime.Now;
            announcement.AnnouncementShow = true;
            announcement.AnnouncementExpiryDate.AddHours(DateTime.Now.Hour + 1);
            announcement.AnnouncementExpiryDate.AddMinutes(DateTime.Now.Minute);
            announcement.AnnouncementExpiryDate.AddSeconds(DateTime.Now.Second);

            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();

            /*var newAnnouncement = new AnnouncementDetails
            {

                //Obavjestenje
                AnnouncementId = announcement.AnnouncementId,
                AnnouncementTitle = announcement.AnnouncementTitle,
                AnnouncementDescription = announcement.AnnouncementDescription,
                AnnouncementDateCreated = announcement.AnnouncementDateCreated,
                AnnouncementDateModified = announcement.AnnouncementDateModified,
                AnnouncementExpiryDate = announcement.AnnouncementExpiryDate,
                ImportantIndicator = announcement.AnnouncementImportantIndicator,
                CategoryId = announcement.CategoryId
            };
            var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == announcement.CategoryId);
            newAnnouncement.CategoryName = categ.CategoryName;
            newAnnouncement.PriorityId = categ.PriorityId;
            var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
            newAnnouncement.PriorityValue = prior.PriorityValue;
            newAnnouncement.UserCreatedId = announcement.UserCreatedId;
            var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == announcement.UserCreatedId);
            newAnnouncement.UserCreatedFirstName = userCreated.FirstName;
            newAnnouncement.UserCreatedLastName = userCreated.LastName;
            if (announcement.UserModifiedId != null)
            {
                newAnnouncement.UserModifiedId = announcement.UserModifiedId;
                var userModified = _userManager.Users.FirstOrDefault(user => user.Id == announcement.UserModifiedId);
                newAnnouncement.UserModifiedFirstName = userModified.FirstName;
                newAnnouncement.UserModifiedLastName = userModified.LastName;
            }
            var files = _context.Files.Where(x => x.AnnouncementId == announcement.AnnouncementId)
                                      .ToList();
            files.ForEach(file =>
            {
                newAnnouncement.Files.Add(file);
            });

            await NewAnnouncement(newAnnouncement);*/

            return Ok(new { announcement });
        }

        // DELETE: api/Announcement/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator, Radnik")]
        public async Task<ActionResult<Announcements>> DeleteAnnouncements(int id)
        {
            var userId = HttpContext.User.Claims.Where(c => c.Type == "userId").FirstOrDefault().Value;
            var userRole = HttpContext.User.Claims.Where(c => c.Type == ClaimsIdentity.DefaultRoleClaimType).FirstOrDefault().Value;

            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
            {
                return NotFound();
            }

            if (announcement.UserCreatedId == userId || userRole == "Administrator")
            {
                _context.Announcements.Remove(announcement);
                await _context.SaveChangesAsync();

                return announcement;
            }
            else
            {
                return Unauthorized();
            }
        }

        private bool AnnouncementsExists(int id)
        {
            return _context.Announcements.Any(e => e.AnnouncementId == id);
        }

        // GET: api/Announcement/announcementDetails
        [HttpGet("announcementDetails")]
        public ActionResult<IEnumerable<AnnouncementDetails>> GetAnnouncementsDetails()
        {
            var anouncementDetailsList = _context.Announcements.OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ? x.AnnouncementDateModified : x.AnnouncementDateCreated)
                                                               .ToList();
            var result = new List<AnnouncementDetails>();

            anouncementDetailsList.ForEach(ann => {
                var resultItem = new AnnouncementDetails
                {

                    //Obavjestenje
                    AnnouncementId = ann.AnnouncementId,
                    AnnouncementTitle = ann.AnnouncementTitle,
                    AnnouncementDescription = ann.AnnouncementDescription,

                    //Datum kreiranja
                    AnnouncementDateCreated = ann.AnnouncementDateCreated,

                    //Datum modifikovanja
                    AnnouncementDateModified = ann.AnnouncementDateModified,

                    //Datum vazenja
                    AnnouncementExpiryDate = ann.AnnouncementExpiryDate,

                    //Indikator vaznosti
                    ImportantIndicator = ann.AnnouncementImportantIndicator,

                    //Kategorija
                    CategoryId = ann.CategoryId
                };
                var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == ann.CategoryId);
                resultItem.CategoryName = categ.CategoryName;

                //Prioritet
                resultItem.PriorityId = categ.PriorityId;
                var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
                resultItem.PriorityValue = prior.PriorityValue;

                //Korisnik koji je kreirao obavjestenje
                resultItem.UserCreatedId = ann.UserCreatedId;
                var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserCreatedId);
                resultItem.UserCreatedFirstName = userCreated.FirstName;
                resultItem.UserCreatedLastName = userCreated.LastName;

                ////Korisnik koji je modifikovao obavjestenje
                if (ann.UserModifiedId != null)
                {
                    resultItem.UserModifiedId = ann.UserModifiedId;
                    var userModified = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserModifiedId);
                    resultItem.UserModifiedFirstName = userModified.FirstName;
                    resultItem.UserModifiedLastName = userModified.LastName;
                }

                var files = _context.Files.Where(x => x.AnnouncementId == ann.AnnouncementId)
                                          .ToList();

                files.ForEach(file =>
                {
                    resultItem.Files.Add(file);
                });
                
                result.Add(resultItem);
            });

            return result;
        }


        // GET: api/Announcement/announcementDetails/1&5
        [HttpGet("announcementDetails/{page}&{pageSize}")]
        public IEnumerable<AnnouncementDetails> GetAnnouncementsDetails(int page, int pageSize)
        {
            var anouncementDetailsList = _context.Announcements.OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ? x.AnnouncementDateModified : x.AnnouncementDateCreated)
                                                               .OrderByDescending(x => x.AnnouncementImportantIndicator)
                                                               .Skip((page - 1)* pageSize)
                                                               .Take(pageSize)
                                                               .ToList();

            var result = new List<AnnouncementDetails>();

            anouncementDetailsList.ForEach(ann => {
                var resultItem = new AnnouncementDetails
                {

                    //Obavjestenje
                    AnnouncementId = ann.AnnouncementId,
                    AnnouncementTitle = ann.AnnouncementTitle,
                    AnnouncementDescription = ann.AnnouncementDescription,

                    //Datum kreiranja
                    AnnouncementDateCreated = ann.AnnouncementDateCreated,

                    //Datum modifikovanja
                    AnnouncementDateModified = ann.AnnouncementDateModified,

                    //Datum vazenja
                    AnnouncementExpiryDate = ann.AnnouncementExpiryDate,

                    //Indikator vaznosti
                    ImportantIndicator = ann.AnnouncementImportantIndicator,
                    Files = _context.Files.Where(x => x.AnnouncementId == ann.AnnouncementId).ToList(),

                    //Kategorija
                    CategoryId = ann.CategoryId
                };
                var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == ann.CategoryId);
                resultItem.CategoryName = categ.CategoryName;

                //Prioritet
                resultItem.PriorityId = categ.PriorityId;
                var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
                resultItem.PriorityValue = prior.PriorityValue;

                //Korisnik koji je kreirao obavjestenje
                resultItem.UserCreatedId = ann.UserCreatedId;
                var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserCreatedId);
                resultItem.UserCreatedFirstName = userCreated.FirstName;
                resultItem.UserCreatedLastName = userCreated.LastName;

                ////Korisnik koji je modifikovao obavjestenje
                if (ann.UserModifiedId != null)
                {
                    resultItem.UserModifiedId = ann.UserModifiedId;
                    var userModified = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserModifiedId);
                    resultItem.UserModifiedFirstName = userModified.FirstName;
                    resultItem.UserModifiedLastName = userModified.LastName;
                }

                //Korisnik koji je kreirao obavjestenje
                //resultItem.UserId = ann.UserId;
                //var us = _context.Users.FirstOrDefault(x => x.UserId == ann.UserId);
                //resultItem.UserFirstName = us.UserFirstName;
                //resultItem.UserLastName = us.UserLastName;
                //resultItem.UserEmail = us.UserEmail;

                ////Tip korisnika koji je krirao obavjestenje
                //resultItem.UserTypeId = us.UserTypeId;
                //var tyUs = _context.UserTypes.FirstOrDefault(x => x.UserTypeId == us.UserTypeId);
                //resultItem.UserTypeName = tyUs.UserTypeName;

                ////Korisnik koji je modifikovao obavjestenje
                //if (ann.AnnouncementUserModified != null)
                //{
                //    resultItem.UserIdModified = ann.AnnouncementUserModified;
                //    var usMod = _context.Users.FirstOrDefault(x => x.UserId == ann.AnnouncementUserModified);
                //    resultItem.UserModifiedFirstName = usMod.UserFirstName;
                //    resultItem.UserModifiedLastName = usMod.UserLastName;
                //    resultItem.UserModifiedEmail = usMod.UserEmail;

                //    //Tip korisnika koji je modifikovao obavjestenje
                //    resultItem.UserModifiedTypeId = usMod.UserTypeId;
                //    var tyUsMod = _context.UserTypes.FirstOrDefault(x => x.UserTypeId == usMod.UserTypeId);
                //    resultItem.UserModifiedTypeName = tyUsMod.UserTypeName;
                //}

                result.Add(resultItem);
            });

            return result;
        }

        // GET: api/Announcement/announcementDetails/5
        [HttpGet("announcementDetails/{id}")]
        public async Task<ActionResult<AnnouncementDetails>> GetAnnouncementsDetails(int id)
        {
            var announcements = await _context.Announcements.FindAsync(id);

            var resultItem = new AnnouncementDetails();

            if (announcements == null)
            {
                return NotFound();
            }

            //Obavjestenje
            resultItem.AnnouncementId = announcements.AnnouncementId;
            resultItem.AnnouncementTitle = announcements.AnnouncementTitle;
            resultItem.AnnouncementDescription = announcements.AnnouncementDescription;

            //Datum kreiranja
            resultItem.AnnouncementDateCreated = announcements.AnnouncementDateCreated;

            //Datum modifikovanja
            resultItem.AnnouncementDateModified = announcements.AnnouncementDateModified;

            //Datum vazenja
            resultItem.AnnouncementExpiryDate = announcements.AnnouncementExpiryDate;

            //Indikator vaznosti
            resultItem.ImportantIndicator = announcements.AnnouncementImportantIndicator;

            //Kategorija
            resultItem.CategoryId = announcements.CategoryId;
            var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == announcements.CategoryId);
            resultItem.CategoryName = categ.CategoryName;

            //Prioritet
            resultItem.PriorityId = categ.PriorityId;
            var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
            resultItem.PriorityValue = prior.PriorityValue;

            //Korisnik koji je kreirao obavjestenje
            resultItem.UserCreatedId = announcements.UserCreatedId;
            var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == announcements.UserCreatedId);
            resultItem.UserCreatedFirstName = userCreated.FirstName;
            resultItem.UserCreatedLastName = userCreated.LastName;

            ////Korisnik koji je modifikovao obavjestenje
            if (announcements.UserModifiedId != null)
            {
                resultItem.UserModifiedId = announcements.UserModifiedId;
                var userModified = _userManager.Users.FirstOrDefault(user => user.Id == announcements.UserModifiedId);
                resultItem.UserModifiedFirstName = userModified.FirstName;
                resultItem.UserModifiedLastName = userModified.LastName;
            }

            var files = _context.Files.Where(x => x.AnnouncementId == announcements.AnnouncementId)
                                      .ToList();

            files.ForEach(file =>
            {
                resultItem.Files.Add(file);
            });

            //Korisnik koji je kreirao obavjestenje
            //resultItem.UserId = announcements.UserId;
            //var us = _context.Users.FirstOrDefault(x => x.UserId == announcements.UserId);
            //resultItem.UserFirstName = us.UserFirstName;
            //resultItem.UserLastName = us.UserLastName;
            //resultItem.UserEmail = us.UserEmail;

            ////Tip korisnika koji je krirao obavjestenje
            //resultItem.UserTypeId = us.UserTypeId;
            //var tyUs = _context.UserTypes.FirstOrDefault(x => x.UserTypeId == us.UserTypeId);
            //resultItem.UserTypeName = tyUs.UserTypeName;

            ////Korisnik koji je modifikovao obavjestenje
            //if (announcements.AnnouncementUserModified != null)
            //{
            //    resultItem.UserIdModified = announcements.AnnouncementUserModified;
            //    var usMod = _context.Users.FirstOrDefault(x => x.UserId == announcements.AnnouncementUserModified);
            //    resultItem.UserModifiedFirstName = usMod.UserFirstName;
            //    resultItem.UserModifiedLastName = usMod.UserLastName;
            //    resultItem.UserModifiedEmail = usMod.UserEmail;

            //    //Tip korisnika koji je modifikovao obavjestenje
            //    resultItem.UserModifiedTypeId = usMod.UserTypeId;
            //    var tyUsMod = _context.UserTypes.FirstOrDefault(x => x.UserTypeId == usMod.UserTypeId);
            //    resultItem.UserModifiedTypeName = tyUsMod.UserTypeName;
            //}

            return resultItem;
        }

        // GET: api/Announcement/numberOfAnnouncements
        [HttpGet("numberOfAnnouncements")]
        public int GetAnnouncementsLenght()
        {
            return _context.Announcements.Count();
        }

        // GET: api/Announcement/numberOfAnnouncementsPerCategory/2
        [HttpGet("numberOfAnnouncementsPerCategory/{id}")]
        public int GetAnnouncementsPerCategoryLenght(int id)
        {
            return _context.Announcements.Where(x => x.CategoryId == id).Count();
        }

        // GET: api/Announcement/announcementDetailsFromCategory/1&1&5
        [HttpGet("announcementDetailsFromCategory/{id}&{page}&{pageSize}")]
        public ActionResult<IEnumerable<AnnouncementDetails>> GetAnnouncementsDetailsFromCategory(int id, int page, int pageSize)
        {
            var result = new List<AnnouncementDetails>();

            if (id != 0)
            {
                var announcementDetailsListFromCategory = _context.Announcements.Where(x => x.CategoryId == id)
                                                                                .OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ? x.AnnouncementDateModified : x.AnnouncementDateCreated)
                                                                                .OrderByDescending(x => x.AnnouncementImportantIndicator)
                                                                                .Skip((page - 1) * pageSize)
                                                                                .Take(pageSize)
                                                                                .ToList();

                announcementDetailsListFromCategory.ForEach(ann => {

                    var resultItem = new AnnouncementDetails
                    {

                        //Obavjestenje
                        AnnouncementId = ann.AnnouncementId,
                        AnnouncementTitle = ann.AnnouncementTitle,
                        AnnouncementDescription = ann.AnnouncementDescription,

                        //Datum kreiranja
                        AnnouncementDateCreated = ann.AnnouncementDateCreated,

                        //Datum modifikovanja
                        AnnouncementDateModified = ann.AnnouncementDateModified,

                        //Datum vazenja
                        AnnouncementExpiryDate = ann.AnnouncementExpiryDate,

                        //Indikator vaznosti
                        ImportantIndicator = ann.AnnouncementImportantIndicator,

                        //Kategorija
                        CategoryId = ann.CategoryId
                    };
                    var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == ann.CategoryId);
                    resultItem.CategoryName = categ.CategoryName;

                    //Prioritet
                    resultItem.PriorityId = categ.PriorityId;
                    var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
                    resultItem.PriorityValue = prior.PriorityValue;

                    //Korisnik koji je kreirao obavjestenje
                    resultItem.UserCreatedId = ann.UserCreatedId;
                    var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserCreatedId);
                    resultItem.UserCreatedFirstName = userCreated.FirstName;
                    resultItem.UserCreatedLastName = userCreated.LastName;

                    ////Korisnik koji je modifikovao obavjestenje
                    if (ann.UserModifiedId != null)
                    {
                        resultItem.UserModifiedId = ann.UserModifiedId;
                        var userModified = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserModifiedId);
                        resultItem.UserModifiedFirstName = userModified.FirstName;
                        resultItem.UserModifiedLastName = userModified.LastName;
                    }

                    //Korisnik koji je kreirao obavjestenje
                    //resultItem.UserId = ann.UserId;
                    //var us = _context.Users.FirstOrDefault(x => x.UserId == ann.UserId);
                    //resultItem.UserFirstName = us.UserFirstName;
                    //resultItem.UserLastName = us.UserLastName;
                    //resultItem.UserEmail = us.UserEmail;

                    ////Tip korisnika koji je krirao obavjestenje
                    //resultItem.UserTypeId = us.UserTypeId;
                    //var tyUs = _context.UserTypes.FirstOrDefault(x => x.UserTypeId == us.UserTypeId);
                    //resultItem.UserTypeName = tyUs.UserTypeName;

                    ////Korisnik koji je modifikovao obavjestenje
                    //if (ann.AnnouncementUserModified != null)
                    //{
                    //    resultItem.UserIdModified = ann.AnnouncementUserModified;
                    //    var usMod = _context.Users.FirstOrDefault(x => x.UserId == ann.AnnouncementUserModified);
                    //    resultItem.UserModifiedFirstName = usMod.UserFirstName;
                    //    resultItem.UserModifiedLastName = usMod.UserLastName;
                    //    resultItem.UserModifiedEmail = usMod.UserEmail;

                    //    //Tip korisnika koji je modifikovao obavjestenje
                    //    resultItem.UserModifiedTypeId = usMod.UserTypeId;
                    //    var tyUsMod = _context.UserTypes.FirstOrDefault(x => x.UserTypeId == usMod.UserTypeId);
                    //    resultItem.UserModifiedTypeName = tyUsMod.UserTypeName;
                    //}

                    result.Add(resultItem);
                });

                return result;
            }
            else
            {
                return result;
            }
        }

        // GET: api/Announcement/announcementNumberForUser
        [HttpGet("announcementNumberForUser")]
        public int GetAnnouncementNumberForUser()
        {
            var userId = HttpContext.User.Claims.Where(c => c.Type == "userId")
                                                .FirstOrDefault().Value;

            return _context.Announcements.Where(x => x.UserCreatedId == userId)
                                         .Count();
        }

        // GET: api/Announcement/announcementDetailsForUserPerPage/1&5
        [HttpGet("announcementDetailsForUserPerPage/{page}&{pageSize}")]
        [Authorize(Roles = "Administrator, Radnik")]
        public ActionResult<IEnumerable<AnnouncementDetails>> GetAnnouncementDetailsForUserPerPage(int page, int pageSize)
        {
            if (HttpContext.User.HasClaim(c => c.Type == "userId"))
            {
                var userId = HttpContext.User.Claims.Where(c => c.Type == "userId").FirstOrDefault().Value;

                var announcementDetailsListFromCategory = _context.Announcements.OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ? x.AnnouncementDateModified : x.AnnouncementDateCreated)
                                                                                .OrderByDescending(x => x.AnnouncementImportantIndicator)
                                                                                .Where(x => x.UserCreatedId == userId)
                                                                                .Skip((page - 1) * pageSize)
                                                                                .Take(pageSize)
                                                                                .ToList();

                var result = new List<AnnouncementDetails>();

                announcementDetailsListFromCategory.ForEach(ann => {

                    var resultItem = new AnnouncementDetails
                    {

                        //Obavjestenje
                        AnnouncementId = ann.AnnouncementId,
                        AnnouncementTitle = ann.AnnouncementTitle,
                        AnnouncementDescription = ann.AnnouncementDescription,
                        Files = _context.Files.Where(x => x.AnnouncementId == ann.AnnouncementId).ToList(),

                        //Datum kreiranja
                        AnnouncementDateCreated = ann.AnnouncementDateCreated,

                        //Datum modifikovanja
                        AnnouncementDateModified = ann.AnnouncementDateModified,

                        //Datum vazenja
                        AnnouncementExpiryDate = ann.AnnouncementExpiryDate,

                        //Indikator vaznosti
                        ImportantIndicator = ann.AnnouncementImportantIndicator,

                        //Kategorija
                        CategoryId = ann.CategoryId
                    };
                    var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == ann.CategoryId);
                    resultItem.CategoryName = categ.CategoryName;

                    //Prioritet
                    resultItem.PriorityId = categ.PriorityId;
                    var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
                    resultItem.PriorityValue = prior.PriorityValue;

                    //Korisnik koji je kreirao obavjestenje
                    resultItem.UserCreatedId = ann.UserCreatedId;
                    var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserCreatedId);
                    resultItem.UserCreatedFirstName = userCreated.FirstName;
                    resultItem.UserCreatedLastName = userCreated.LastName;

                    ////Korisnik koji je modifikovao obavjestenje
                    if (ann.UserModifiedId != null)
                    {
                        resultItem.UserModifiedId = ann.UserModifiedId;
                        var userModified = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserModifiedId);
                        resultItem.UserModifiedFirstName = userModified.FirstName;
                        resultItem.UserModifiedLastName = userModified.LastName;
                    }

                    result.Add(resultItem);
                });

                return result;
            }

            return BadRequest(new { message = "User is not logged in." });
        }

        // POST: api/Announcement/filteredAnnouncements/1&5
        [HttpPost("filteredAnnouncements/{page}&{pageSize}")]
        public ActionResult<IEnumerable<AnnouncementDetails>> GetFilteredAnnouncements(AnnouncementSearch ann, int page, int pageSize)
        {
            IQueryable<Announcements> query = _context.Announcements;

            //Filtering
            if (!string.IsNullOrWhiteSpace(ann.AnnouncementTitle))
            {
                query = query.Where(x => x.AnnouncementTitle.ToLower().Contains(ann.AnnouncementTitle.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(ann.AnnouncementDescription))
            {
                query = query.Where(x => x.AnnouncementDescription.ToLower().Contains(ann.AnnouncementDescription.ToLower()));
            }

            if (ann.CategoryId != 0)
            {
                query = query.Where(x => x.CategoryId == ann.CategoryId);
            }

            if (!string.IsNullOrWhiteSpace(ann.AnnouncementDateCreated.ToString()))
            {
                query = query.Where(x => (x.AnnouncementDateCreated.Date == ann.AnnouncementDateCreated.Value.Date));
            }

            if (!string.IsNullOrWhiteSpace(ann.AnnouncementDateModified.ToString()))
            {
                query = query.Where(x => (x.AnnouncementDateModified.Value.Date == ann.AnnouncementDateModified.Value.Date));
            }

            if (!string.IsNullOrWhiteSpace(ann.UserCreatedId))
            {
                query = query.Where(x => x.UserCreatedId == ann.UserCreatedId);
            }

            if (!string.IsNullOrWhiteSpace(ann.UserModifiedId))
            {
                query = query.Where(x => x.UserModifiedId == ann.UserModifiedId);
            }

            if (ann.AnnouncementImportantIndicator != 0)
            {
                query = query.Where(x => x.AnnouncementImportantIndicator == ann.AnnouncementImportantIndicator);
            }

            //Sorting

            //Pagination
            var numberOfAnnouncement = query.Count();
            var anouncementDetailsList = query.OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ? x.AnnouncementDateModified : x.AnnouncementDateCreated)
                                              .OrderByDescending(x => x.AnnouncementImportantIndicator)
                                              .Skip((page - 1) * pageSize)
                                              .Take(pageSize)
                                              .ToList();

            var result = new List<AnnouncementDetails>();

            anouncementDetailsList.ForEach(item => {
                var resultItem = new AnnouncementDetails
                {

                    //Obavjestenje
                    AnnouncementId = item.AnnouncementId,
                    AnnouncementTitle = item.AnnouncementTitle,
                    AnnouncementDescription = item.AnnouncementDescription,

                    //Datum kreiranja
                    AnnouncementDateCreated = item.AnnouncementDateCreated,

                    //Datum modifikovanja
                    AnnouncementDateModified = item.AnnouncementDateModified,

                    //Datum vazenja
                    AnnouncementExpiryDate = item.AnnouncementExpiryDate,

                    //Indikator vaznosti
                    ImportantIndicator = item.AnnouncementImportantIndicator,

                    //Kategorija
                    CategoryId = item.CategoryId
                };
                var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == item.CategoryId);
                resultItem.CategoryName = categ.CategoryName;

                //Prioritet
                resultItem.PriorityId = categ.PriorityId;
                var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
                resultItem.PriorityValue = prior.PriorityValue;

                //Korisnik koji je kreirao obavjestenje
                resultItem.UserCreatedId = item.UserCreatedId;
                var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == item.UserCreatedId);
                resultItem.UserCreatedFirstName = userCreated.FirstName;
                resultItem.UserCreatedLastName = userCreated.LastName;

                ////Korisnik koji je modifikovao obavjestenje
                if (!string.IsNullOrWhiteSpace(item.UserModifiedId))
                {
                    resultItem.UserModifiedId = item.UserModifiedId;
                    var userModified = _userManager.Users.FirstOrDefault(user => user.Id == item.UserModifiedId);
                    resultItem.UserModifiedFirstName = userModified.FirstName;
                    resultItem.UserModifiedLastName = userModified.LastName;
                }

                result.Add(resultItem);
            });

            return Ok(new { result, numberOfAnnouncement });
        }

        [HttpGet("search/")]
        [Authorize(Roles = "Administrator, Radnik")]
        public ActionResult<IEnumerable<AnnouncementDetails>> GetFilteredAnnouncements([FromQuery(Name = "search-term")]string searchTerm, [FromQuery(Name = "current-page")]int page, [FromQuery(Name = "page-size")]int pageSize)
        {
            if (HttpContext.User.HasClaim(c => c.Type == "userId"))
            {
                var userId = HttpContext.User.Claims.Where(c => c.Type == "userId").FirstOrDefault().Value;

                //IQueryable<Announcements> query = _context.Announcements;
                var anouncementDetailsList = _context.Announcements.Where(x => x.UserCreatedId == userId)
                                                                   .ToList();

                var numberOfAnnouncement = 0;

                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    anouncementDetailsList = anouncementDetailsList.Where(x => x.AnnouncementDescription.ToLower().Contains(searchTerm.ToLower()) ||
                                                                               x.AnnouncementTitle.ToLower().Contains(searchTerm.ToLower()))
                        .ToList();
                    numberOfAnnouncement = anouncementDetailsList.Count();
                    anouncementDetailsList = anouncementDetailsList.OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ? x.AnnouncementDateModified : x.AnnouncementDateCreated)
                                                                   .OrderByDescending(x => x.AnnouncementImportantIndicator)
                                                                   .Skip((page - 1) * pageSize)
                                                                   .Take(pageSize)
                                                                   .ToList();
                }
                else
                {
                    numberOfAnnouncement = anouncementDetailsList.Count();
                    anouncementDetailsList = anouncementDetailsList.OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ? x.AnnouncementDateModified : x.AnnouncementDateCreated)
                                                                   .OrderByDescending(x => x.AnnouncementImportantIndicator)
                                                                   .Skip((page - 1) * pageSize)
                                                                   .Take(pageSize)
                                                                   .ToList();
                }

                var result = new List<AnnouncementDetails>();


                anouncementDetailsList.ForEach(item =>
                {
                    var resultItem = new AnnouncementDetails
                    {

                        //Obavjestenje
                        AnnouncementId = item.AnnouncementId,
                        AnnouncementTitle = item.AnnouncementTitle,
                        AnnouncementDescription = item.AnnouncementDescription,

                        //Datum kreiranja
                        AnnouncementDateCreated = item.AnnouncementDateCreated,

                        //Datum modifikovanja
                        AnnouncementDateModified = item.AnnouncementDateModified,

                        //Datum vazenja
                        AnnouncementExpiryDate = item.AnnouncementExpiryDate,

                        //Indikator vaznosti
                        ImportantIndicator = item.AnnouncementImportantIndicator,

                        //Kategorija
                        CategoryId = item.CategoryId
                    };
                    var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == item.CategoryId);
                    resultItem.CategoryName = categ.CategoryName;

                    //Prioritet
                    resultItem.PriorityId = categ.PriorityId;
                    var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
                    resultItem.PriorityValue = prior.PriorityValue;

                    //Korisnik koji je kreirao obavjestenje
                    resultItem.UserCreatedId = item.UserCreatedId;
                    var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == item.UserCreatedId);
                    resultItem.UserCreatedFirstName = userCreated.FirstName;
                    resultItem.UserCreatedLastName = userCreated.LastName;

                    ////Korisnik koji je modifikovao obavjestenje
                    if (!string.IsNullOrWhiteSpace(item.UserModifiedId))
                    {
                        resultItem.UserModifiedId = item.UserModifiedId;
                        var userModified = _userManager.Users.FirstOrDefault(user => user.Id == item.UserModifiedId);
                        resultItem.UserModifiedFirstName = userModified.FirstName;
                        resultItem.UserModifiedLastName = userModified.LastName;
                    }

                    result.Add(resultItem);
                });

                return Ok(new { result, numberOfAnnouncement });
            }

            return BadRequest(new { message = "User is not logged in." });
        }

        //[HttpGet("announcementDetailsFromSameCategory/{categoryId}&{announcementId}&{takeNumberAnn}")]
        [HttpGet("announcementDetailsFromSameCategory/{categoryId}&{announcementId}")]
        public ActionResult<IEnumerable<AnnouncementDetails>> GetAnnouncementsDetailsFromSameCategory(int categoryId, int announcementId)
        {
            //var announcementDetails = _context.Announcements.OrderByDescending(x => x.AnnouncementDateCreated)
            //                                                .OrderByDescending(x => x.AnnouncementDateModified)
            //                                                .OrderByDescending(x => x.AnnouncementImportantIndicator)
            //                                                .Take(3)
            //                                                .Where(x => x.CategoryId == categoryId)
            //                                                .ToList();

            var announcementDetails = _context.Announcements.Where(x => (x.CategoryId == categoryId && 
                                                                         x.AnnouncementId != announcementId))
                                                            .ToList();

            var filteredAnnouncementDetailsList = announcementDetails.OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ? x.AnnouncementDateModified : x.AnnouncementDateCreated)
                                                                     .OrderByDescending(x => x.AnnouncementImportantIndicator)
                                                                     .Take(3)
                                                                     .ToList();
            var result = new List<AnnouncementDetails>();

            filteredAnnouncementDetailsList.ForEach(ann =>
            {
                var resultItem = new AnnouncementDetails
                {
                    AnnouncementId = ann.AnnouncementId,
                    AnnouncementTitle = ann.AnnouncementTitle,
                    AnnouncementDescription = ann.AnnouncementDescription,

                    //Datum kreiranja
                    AnnouncementDateCreated = ann.AnnouncementDateCreated,

                    //Datum modifikovanja
                    AnnouncementDateModified = ann.AnnouncementDateModified,

                    //Datum vazenja
                    AnnouncementExpiryDate = ann.AnnouncementExpiryDate,

                    //Indikator vaznosti
                    ImportantIndicator = ann.AnnouncementImportantIndicator,

                    //Kategorija
                    CategoryId = ann.CategoryId
                };
                var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == ann.CategoryId);
                resultItem.CategoryName = categ.CategoryName;

                //Prioritet
                resultItem.PriorityId = categ.PriorityId;
                var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
                resultItem.PriorityValue = prior.PriorityValue;

                //Korisnik koji je kreirao obavjestenje
                resultItem.UserCreatedId = ann.UserCreatedId;
                var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserCreatedId);
                resultItem.UserCreatedFirstName = userCreated.FirstName;
                resultItem.UserCreatedLastName = userCreated.LastName;

                ////Korisnik koji je modifikovao obavjestenje
                if (ann.UserModifiedId != null)
                {
                    resultItem.UserModifiedId = ann.UserModifiedId;
                    var userModified = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserModifiedId);
                    resultItem.UserModifiedFirstName = userModified.FirstName;
                    resultItem.UserModifiedLastName = userModified.LastName;
                }

                result.Add(resultItem);
            });

            return result;
        }

        /*[HttpGet("announcementDetailsPerCategory/{numberOfAnn}")]
        public ActionResult<IEnumerable<AnnouncementDetails>> GetAnnouncementsDetailsPerCategory(int numberOfAnn)
        {

            ActionResult<IEnumerable<AnnouncementDetails>> result;
            result = GetAnnouncementsDetails();

            return null;
        }*/

        [HttpGet("numberTheMostImportantAnnouncements")]
        public int GetNumberTheMostImportantAnnouncements()
        {
            return _context.Announcements.Where(x => (x.AnnouncementImportantIndicator == 1 && 
                                                      x.AnnouncementShow == true))
                                         .Count();
        }

        [HttpGet("theMostImportantAnnouncementsPerPage/{page}&{pageSize}")]
        public ActionResult<IEnumerable<AnnouncementDetails>> GetTheMostImportantAnnouncementsPerPage(int page, int pageSize)
        {
            var announcemenstDetails = _context.Announcements.Where(x => (x.AnnouncementImportantIndicator == 1 && 
                                                                          x.AnnouncementShow == true))
                                                             .ToList();

            var filteredAnnouncemenstDetails = announcemenstDetails.OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ? x.AnnouncementDateModified : x.AnnouncementDateCreated)
                                                                   .Skip((page - 1) * pageSize)
                                                                   .Take(pageSize)
                                                                   .ToList();

            // categories = _context.Categories.Where(x => x.CategoryId == categoryId).ToList();
            var result = new List<AnnouncementDetails>();

            filteredAnnouncemenstDetails.ForEach(ann =>
            {
                var resultItem = new AnnouncementDetails
                {
                    AnnouncementId = ann.AnnouncementId,
                    AnnouncementTitle = ann.AnnouncementTitle,
                    AnnouncementDescription = ann.AnnouncementDescription,

                    //Datum kreiranja
                    AnnouncementDateCreated = ann.AnnouncementDateCreated,

                    //Datum modifikovanja
                    AnnouncementDateModified = ann.AnnouncementDateModified,

                    //Datum vazenja
                    AnnouncementExpiryDate = ann.AnnouncementExpiryDate,

                    //Indikator vaznosti
                    ImportantIndicator = ann.AnnouncementImportantIndicator,

                    //Kategorija
                    CategoryId = ann.CategoryId
                };
                var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == ann.CategoryId);
                resultItem.CategoryName = categ.CategoryName;

                //Prioritet
                resultItem.PriorityId = categ.PriorityId;
                var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
                resultItem.PriorityValue = prior.PriorityValue;

                //Korisnik koji je kreirao obavjestenje
                resultItem.UserCreatedId = ann.UserCreatedId;
                var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserCreatedId);
                resultItem.UserCreatedFirstName = userCreated.FirstName;
                resultItem.UserCreatedLastName = userCreated.LastName;

                ////Korisnik koji je modifikovao obavjestenje
                if (ann.UserModifiedId != null)
                {
                    resultItem.UserModifiedId = ann.UserModifiedId;
                    var userModified = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserModifiedId);
                    resultItem.UserModifiedFirstName = userModified.FirstName;
                    resultItem.UserModifiedLastName = userModified.LastName;
                }

                result.Add(resultItem);
            });

            return result;
        }

        [HttpGet("theMostImportant/{numberOfAnnouncements}")]
        public ActionResult<IEnumerable<AnnouncementDetails>> GetTheMostImportantAnnouncements(int numberOfAnnouncements)
        {
            var announcemenstDetails = _context.Announcements.Where(x => (x.AnnouncementImportantIndicator == 1 && 
                                                                          x.AnnouncementShow == true))
                                                             .ToList();
            var filteredAnnouncemenstDetails = announcemenstDetails.OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ? x.AnnouncementDateModified : x.AnnouncementDateCreated)
                                                                   .Take(numberOfAnnouncements)
                                                                   .ToList();

            // categories = _context.Categories.Where(x => x.CategoryId == categoryId).ToList();
            var result = new List<AnnouncementDetails>();

            filteredAnnouncemenstDetails.ForEach(ann =>
            {
                var resultItem = new AnnouncementDetails
                {
                    AnnouncementId = ann.AnnouncementId,
                    AnnouncementTitle = ann.AnnouncementTitle,
                    AnnouncementDescription = ann.AnnouncementDescription,

                    //Datum kreiranja
                    AnnouncementDateCreated = ann.AnnouncementDateCreated,

                    //Datum modifikovanja
                    AnnouncementDateModified = ann.AnnouncementDateModified,

                    //Datum vazenja
                    AnnouncementExpiryDate = ann.AnnouncementExpiryDate,

                    //Indikator vaznosti
                    ImportantIndicator = ann.AnnouncementImportantIndicator,

                    //Kategorija
                    CategoryId = ann.CategoryId
                };
                var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == ann.CategoryId);
                resultItem.CategoryName = categ.CategoryName;

                //Prioritet
                resultItem.PriorityId = categ.PriorityId;
                var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
                resultItem.PriorityValue = prior.PriorityValue;

                //Korisnik koji je kreirao obavjestenje
                resultItem.UserCreatedId = ann.UserCreatedId;
                var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserCreatedId);
                resultItem.UserCreatedFirstName = userCreated.FirstName;
                resultItem.UserCreatedLastName = userCreated.LastName;

                ////Korisnik koji je modifikovao obavjestenje
                if (ann.UserModifiedId != null)
                {
                    resultItem.UserModifiedId = ann.UserModifiedId;
                    var userModified = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserModifiedId);
                    resultItem.UserModifiedFirstName = userModified.FirstName;
                    resultItem.UserModifiedLastName = userModified.LastName;
                }

                result.Add(resultItem);
            });

            return result;
        }

        [HttpGet("theLatest/{numberOfAnnouncements}")]
        public ActionResult<IEnumerable<AnnouncementDetails>> GetTheLatestAnnouncements(int numberOfAnnouncements)
        {
            var filteredAnnouncementDetails = _context.Announcements.Where(x => x.AnnouncementShow == true)
                                                                    .OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ? x.AnnouncementDateModified : x.AnnouncementDateCreated)
                                                                    .Take(numberOfAnnouncements)
                                                                    .ToList();
            // categories = _context.Categories.Where(x => x.CategoryId == categoryId).ToList();
            var result = new List<AnnouncementDetails>();

            filteredAnnouncementDetails.ForEach(ann =>
            {
                var resultItem = new AnnouncementDetails
                {
                    AnnouncementId = ann.AnnouncementId,
                    AnnouncementTitle = ann.AnnouncementTitle,
                    AnnouncementDescription = ann.AnnouncementDescription,

                    //Datum kreiranja
                    AnnouncementDateCreated = ann.AnnouncementDateCreated,

                    //Datum modifikovanja
                    AnnouncementDateModified = ann.AnnouncementDateModified,

                    //Datum vazenja
                    AnnouncementExpiryDate = ann.AnnouncementExpiryDate,

                    //Indikator vaznosti
                    ImportantIndicator = ann.AnnouncementImportantIndicator,

                    //Kategorija
                    CategoryId = ann.CategoryId
                };
                var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == ann.CategoryId);
                resultItem.CategoryName = categ.CategoryName;

                //Prioritet
                resultItem.PriorityId = categ.PriorityId;
                var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
                resultItem.PriorityValue = prior.PriorityValue;

                //Korisnik koji je kreirao obavjestenje
                resultItem.UserCreatedId = ann.UserCreatedId;
                var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserCreatedId);
                resultItem.UserCreatedFirstName = userCreated.FirstName;
                resultItem.UserCreatedLastName = userCreated.LastName;

                ////Korisnik koji je modifikovao obavjestenje
                if (ann.UserModifiedId != null)
                {
                    resultItem.UserModifiedId = ann.UserModifiedId;
                    var userModified = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserModifiedId);
                    resultItem.UserModifiedFirstName = userModified.FirstName;
                    resultItem.UserModifiedLastName = userModified.LastName;
                }

                result.Add(resultItem);
            });

            return result;
        }

        [HttpGet("theLatestPerPage/{page}&{pageSize}")]
        public ActionResult<IEnumerable<AnnouncementDetails>> GetTheLatestAnnouncementsPerPage(int page, int pageSize)
        {
            var theLatest = _context.Announcements.Where(x => x.AnnouncementShow == true).AsNoTracking();

            var filteredAnnouncementDetails = theLatest.OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ? x.AnnouncementDateModified : x.AnnouncementDateCreated)
                                                       .Skip((page - 1) * pageSize)
                                                       .Take(pageSize)
                                                       .ToList();

            var numberOfAnnouncements = theLatest.Count();
            // categories = _context.Categories.Where(x => x.CategoryId == categoryId).ToList();
            var result = new List<AnnouncementDetails>();

            filteredAnnouncementDetails.ForEach(ann =>
            {
                var resultItem = new AnnouncementDetails
                {
                    AnnouncementId = ann.AnnouncementId,
                    AnnouncementTitle = ann.AnnouncementTitle,
                    AnnouncementDescription = ann.AnnouncementDescription,

                    //Datum kreiranja
                    AnnouncementDateCreated = ann.AnnouncementDateCreated,

                    //Datum modifikovanja
                    AnnouncementDateModified = ann.AnnouncementDateModified,

                    //Datum vazenja
                    AnnouncementExpiryDate = ann.AnnouncementExpiryDate,

                    //Indikator vaznosti
                    ImportantIndicator = ann.AnnouncementImportantIndicator,

                    //Kategorija
                    CategoryId = ann.CategoryId
                };
                var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == ann.CategoryId);
                resultItem.CategoryName = categ.CategoryName;

                //Prioritet
                resultItem.PriorityId = categ.PriorityId;
                var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
                resultItem.PriorityValue = prior.PriorityValue;

                //Korisnik koji je kreirao obavjestenje
                resultItem.UserCreatedId = ann.UserCreatedId;
                var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserCreatedId);
                resultItem.UserCreatedFirstName = userCreated.FirstName;
                resultItem.UserCreatedLastName = userCreated.LastName;

                ////Korisnik koji je modifikovao obavjestenje
                if (ann.UserModifiedId != null)
                {
                    resultItem.UserModifiedId = ann.UserModifiedId;
                    var userModified = _userManager.Users.FirstOrDefault(user => user.Id == ann.UserModifiedId);
                    resultItem.UserModifiedFirstName = userModified.FirstName;
                    resultItem.UserModifiedLastName = userModified.LastName;
                }

                result.Add(resultItem);
            });

            return Ok(new { result, numberOfAnnouncements });
        }

        // GET: api/Announcement/announcementStatistic
        [HttpGet("announcementStatistic")]
        public ActionResult<IEnumerable<Object>> GetAnnouncementsStatistc()
        {
            var announcements = _context.Announcements.ToList();
            var users = _userManager.Users.ToList();

            var listOfStatistic = new List<Statistic>();

            users.ForEach(user => 
            {
                var statistic = new Statistic
                {
                    User = user.FirstName + " " + user.LastName,
                    NumberOfUserAnnouncements = announcements.Where(x => x.UserCreatedId == user.Id).Count()
                };

                listOfStatistic.Add(statistic);
            });

            return listOfStatistic;
        }
    }
}
