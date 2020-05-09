using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElektronskaOglasnaTabla.Domain.Models;
using ElektronskaOglasnaTabla.Domain.CustomModels;

namespace ElektronskaOglasnaTabla.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementController : ControllerBase
    {
        private readonly ElektronskaOglasnaTablaContext _context;

        public AnnouncementController(ElektronskaOglasnaTablaContext context)
        {
            _context = context;
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

            return announcements;
        }

        // PUT: api/Announcement/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnnouncements(int id, Announcements announcements)
        {
            if (id != announcements.AnnouncementId)
            {
                return BadRequest();
            }

            _context.Entry(announcements).State = EntityState.Modified;

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

            return NoContent();
        }

        // POST: api/Announcement
        [HttpPost]
        public async Task<ActionResult<Announcements>> PostAnnouncements(Announcements announcements)
        {
            _context.Announcements.Add(announcements);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAnnouncements", new { id = announcements.AnnouncementId }, announcements);
        }

        // DELETE: api/Announcement/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Announcements>> DeleteAnnouncements(int id)
        {
            var announcements = await _context.Announcements.FindAsync(id);
            if (announcements == null)
            {
                return NotFound();
            }

            _context.Announcements.Remove(announcements);
            await _context.SaveChangesAsync();

            return announcements;
        }

        private bool AnnouncementsExists(int id)
        {
            return _context.Announcements.Any(e => e.AnnouncementId == id);
        }

        // GET: api/Announcement/announcementDetails
        [HttpGet("announcementDetails")]
        public ActionResult<IEnumerable<AnnouncementDetails>> GetAnnouncementsDetails()
        {
            var anouncementDetailsList = _context.Announcements.ToList();
            var result = new List<AnnouncementDetails>();

            anouncementDetailsList.ForEach(ann => {
                var resultItem = new AnnouncementDetails();

                //Obavjestenje
                resultItem.AnnouncementId = ann.AnnouncementId;
                resultItem.AnnouncementTitle = ann.AnnouncementTitle;
                resultItem.AnnouncementDescription = ann.AnnouncementDescription;

                //Datum kreiranja
                resultItem.AnnouncementDateCreated = ann.AnnouncementDateCreated;

                //Datum modifikovanja
                resultItem.AnnouncementDateModified = ann.AnnouncementDateModified;

                //Datum vazenja
                resultItem.AnnouncementExpiryDate = ann.AnnouncementExpiryDate;

                //Indikator vaznosti
                resultItem.ImportantIndicator = ann.AnnouncementImportantIndicator;

                //Kategorija
                resultItem.CategoryId = ann.CategoryId;
                var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == ann.CategoryId);
                resultItem.CategoryName = categ.CategoryName;

                //Prioritet
                resultItem.PriorityId = categ.PriorityId;
                var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
                resultItem.PriorityValue = prior.PriorityValue;

                //Korisnik koji je kreirao obavjestenje
                resultItem.UserId = ann.UserId;
                var us = _context.Users.FirstOrDefault(x => x.UserId == ann.UserId);
                resultItem.UserFirstName = us.UserFirstName;
                resultItem.UserLastName = us.UserLastName;
                resultItem.UserEmail = us.UserEmail;

                //Tip korisnika koji je krirao obavjestenje
                resultItem.UserTypeId = us.UserTypeId;
                var tyUs = _context.UserTypes.FirstOrDefault(x => x.UserTypeId == us.UserTypeId);
                resultItem.UserTypeName = tyUs.UserTypeName;

                //Korisnik koji je modifikovao obavjestenje
                if (ann.AnnouncementUserModified != null)
                {
                    resultItem.UserIdModified = ann.AnnouncementUserModified;
                    var usMod = _context.Users.FirstOrDefault(x => x.UserId == ann.AnnouncementUserModified);
                    resultItem.UserModifiedFirstName = usMod.UserFirstName;
                    resultItem.UserModifiedLastName = usMod.UserLastName;
                    resultItem.UserModifiedEmail = usMod.UserEmail;

                    //Tip korisnika koji je modifikovao obavjestenje
                    resultItem.UserModifiedTypeId = usMod.UserTypeId;
                    var tyUsMod = _context.UserTypes.FirstOrDefault(x => x.UserTypeId == usMod.UserTypeId);
                    resultItem.UserModifiedTypeName = tyUsMod.UserTypeName;
                }

                result.Add(resultItem);
            });

            return result;
        }
    }
}
