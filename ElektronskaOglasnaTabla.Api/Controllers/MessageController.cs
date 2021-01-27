using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElektronskaOglasnaTabla.Api.Hubs;
using ElektronskaOglasnaTabla.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ElektronskaOglasnaTabla.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
       /* private IHubContext<MessageHub> _hub;

        public MessageController(IHubContext<MessageHub> hub)
        {
            _hub = hub;
        }

        public async Task NewMessage(Message msg)
        {
            await _hub.Clients.All.SendAsync("MessageReceived", msg);
        }*/
    }
}