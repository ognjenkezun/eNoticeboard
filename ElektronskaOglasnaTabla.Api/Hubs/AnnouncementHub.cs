using ElektronskaOglasnaTabla.Domain.CustomModels;
using ElektronskaOglasnaTabla.Domain.Models;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace ElektronskaOglasnaTabla.Api.Hubs
{
    public class AnnouncementHub: Hub
    {
        private readonly ElektronskaOglasnaTablaContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public AnnouncementHub(ElektronskaOglasnaTablaContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task NewAnnouncement(Announcements announcement)
        {
            var newAnnouncement = new AnnouncementDetails
            {
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

            await Clients.Others.SendAsync("AddedAnnouncementReceived", newAnnouncement);
        }

        public async Task SendUpdatedAnnouncement(AnnouncementDetails announcement)
        {
            await Clients.Others.SendAsync("UpdatedAnnouncementReceived", announcement  );
        }

        public async Task SendNextImportantAnnouncement(DeleteAnnouncementWS deletedAnnouncementData)
        {
            var nextAnnouncement = _context.Announcements.Where(x => (x.AnnouncementImportantIndicator == 1 &&
                                                                      x.AnnouncementShow == true))
                                                         .OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ? 
                                                                                      x.AnnouncementDateModified : 
                                                                                      x.AnnouncementDateCreated)
                                                         .Skip(deletedAnnouncementData.PageSize - 1)
                                                         .FirstOrDefault();

            await Clients.Others.SendAsync("DeletedImportantAnnouncementIdReceived", nextAnnouncement, deletedAnnouncementData.DeletedAnnouncementId);
        }

        public async Task SendNextTheLatestAnnouncement(DeleteAnnouncementWS deletedAnnouncementData)
        {
            var nextAnnouncement = _context.Announcements.Where(x => x.AnnouncementShow == true)
                                                         .OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ?
                                                                                      x.AnnouncementDateModified :
                                                                                      x.AnnouncementDateCreated)
                                                         .Skip(deletedAnnouncementData.PageSize - 1)
                                                         .FirstOrDefault();

            var nextAnnouncementDetails = new AnnouncementDetails
            {
                AnnouncementId = nextAnnouncement.AnnouncementId,
                AnnouncementTitle = nextAnnouncement.AnnouncementTitle,
                AnnouncementDescription = nextAnnouncement.AnnouncementDescription,
                AnnouncementDateCreated = nextAnnouncement.AnnouncementDateCreated,
                AnnouncementDateModified = nextAnnouncement.AnnouncementDateModified,
                AnnouncementExpiryDate = nextAnnouncement.AnnouncementExpiryDate,
                ImportantIndicator = nextAnnouncement.AnnouncementImportantIndicator,
                CategoryId = nextAnnouncement.CategoryId
            };
            var categ = _context.Categories.FirstOrDefault(x => x.CategoryId == nextAnnouncement.CategoryId);
            nextAnnouncementDetails.CategoryName = categ.CategoryName;
            nextAnnouncementDetails.PriorityId = categ.PriorityId;
            var prior = _context.Priorities.FirstOrDefault(x => x.PriorityId == categ.PriorityId);
            nextAnnouncementDetails.PriorityValue = prior.PriorityValue;
            nextAnnouncementDetails.UserCreatedId = nextAnnouncement.UserCreatedId;
            var userCreated = _userManager.Users.FirstOrDefault(user => user.Id == nextAnnouncement.UserCreatedId);
            nextAnnouncementDetails.UserCreatedFirstName = userCreated.FirstName;
            nextAnnouncementDetails.UserCreatedLastName = userCreated.LastName;
            if (nextAnnouncement.UserModifiedId != null)
            {
                nextAnnouncementDetails.UserModifiedId = nextAnnouncement.UserModifiedId;
                var userModified = _userManager.Users.FirstOrDefault(user => user.Id == nextAnnouncement.UserModifiedId);
                nextAnnouncementDetails.UserModifiedFirstName = userModified.FirstName;
                nextAnnouncementDetails.UserModifiedLastName = userModified.LastName;
            }
            var files = _context.Files.Where(x => x.AnnouncementId == nextAnnouncement.AnnouncementId)
                                      .ToList();
            files.ForEach(file =>
            {
                nextAnnouncementDetails.Files.Add(file);
            });

            await Clients.Others.SendAsync("DeletedTheLatestAnnouncementIdReceived", nextAnnouncementDetails, deletedAnnouncementData.DeletedAnnouncementId);
        }

        public async Task SendNextAnnouncementFromCategory(DeleteAnnouncementWS deletedAnnouncementData)
        {
            var nextAnnouncement = _context.Announcements.Where(x => x.AnnouncementShow == true &&
                                                                     x.CategoryId == deletedAnnouncementData.CategoryId)
                                                         .OrderByDescending(x => (x.AnnouncementDateModified > x.AnnouncementDateCreated) ?
                                                                                      x.AnnouncementDateModified :
                                                                                      x.AnnouncementDateCreated)
                                                         .OrderByDescending(x => x.AnnouncementImportantIndicator)
                                                         .Skip(deletedAnnouncementData.PageSize - 1)
                                                         .FirstOrDefault();

            await Clients.Others.SendAsync("DeletedAnnouncementIdFromCategoryReceived", nextAnnouncement, deletedAnnouncementData.DeletedAnnouncementId);
        }
    }
}
