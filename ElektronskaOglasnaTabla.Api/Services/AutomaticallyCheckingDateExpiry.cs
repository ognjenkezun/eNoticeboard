using ElektronskaOglasnaTabla.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using ElektronskaOglasnaTabla.Api.Hubs;
using Microsoft.AspNetCore.SignalR;

using System.Linq;
using Microsoft.AspNetCore.Http;
using ElektronskaOglasnaTabla.Domain.CustomModels;
using Microsoft.AspNetCore.Authorization;

namespace ElektronskaOglasnaTabla.Api.Services
{
    public class AutomaticallyCheckingDateExpiry : IHostedService, IDisposable
    {
        private Timer _timer;
        public string currentTime;
        private readonly ILogger<AutomaticallyCheckingDateExpiry> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private IHubContext<MessageHub> _hub;

        public AutomaticallyCheckingDateExpiry(ILogger<AutomaticallyCheckingDateExpiry> logger, IServiceScopeFactory scopeFactory, IHubContext<MessageHub> hub)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
            _hub = hub;
        }

        public async Task NewMessage(string msg)
        {
            await _hub.Clients.All.SendAsync("MessageReceived", msg);
        }

        public async Task UpdateExpiredAnnouncement()
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ElektronskaOglasnaTablaContext>();

                var result = await dbContext.Announcements.ToListAsync();
                result.ForEach(async item =>
                {
                    if (item.AnnouncementShow)
                    {
                        if (DateTime.Now > item.AnnouncementExpiryDate)
                        {
                            _logger.LogInformation("Istekalo vrijeme prikazivanja {0}", item.AnnouncementId);
                            item.AnnouncementShow = false;
                            dbContext.Entry(item).State = EntityState.Modified;
                            await NewMessage("Message sent!");
                        }
                    }
                });

                try
                {
                    await dbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException) { throw; }

                //return null;
            }
        }

        async void DoWork(object state)
        {
            currentTime = DateTime.Now.ToString();
            Debug.WriteLine("{0}", currentTime);
            _logger.LogInformation("{0}", currentTime);
            await UpdateExpiredAnnouncement();

        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            _logger.LogInformation("Task completed");
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
