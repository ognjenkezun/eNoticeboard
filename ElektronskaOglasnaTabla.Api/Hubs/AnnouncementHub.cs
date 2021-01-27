using ElektronskaOglasnaTabla.Domain.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ElektronskaOglasnaTabla.Api.Hubs
{
    public class AnnouncementHub: Hub
    {
        public async Task NewAnnouncement(Message msg)
        {
            await Clients.All.SendAsync("MessageRecieved", msg);
        }
    }
}
