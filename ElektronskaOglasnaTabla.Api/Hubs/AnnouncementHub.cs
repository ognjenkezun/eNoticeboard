using ElektronskaOglasnaTabla.Domain.CustomModels;
using ElektronskaOglasnaTabla.Domain.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
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

        public async Task NewAnnouncement(AnnouncementDetails announcement)
        {
            var newAnnouncement = new AnnouncementDetails
            {
                AnnouncementId = announcement.AnnouncementId,
                AnnouncementTitle = announcement.AnnouncementTitle,
                AnnouncementDescription = announcement.AnnouncementDescription,
                AnnouncementDateCreated = announcement.AnnouncementDateCreated,
                AnnouncementDateModified = announcement.AnnouncementDateModified,
                AnnouncementExpiryDate = announcement.AnnouncementExpiryDate,
                ImportantIndicator = announcement.ImportantIndicator,
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

            await Clients.All.SendAsync("AddedAnnouncementReceived", newAnnouncement);
        }

        public async Task SendUpdatedAnnouncement(AnnouncementDetails announcement)
        {
            await Clients.All.SendAsync("UpdatedAnnouncementReceived", announcement);
        }

        public async Task SendDeletedAnnouncementId(int announcementId)
        {
            await Clients.All.SendAsync("DeletedAnnouncementIdReceived", announcementId);
        }
    }
}
