using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElektronskaOglasnaTabla.Domain.Models;
using Microsoft.AspNetCore.Authorization;

namespace ElektronskaOglasnaTabla.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppConfigsController : ControllerBase
    {
        private readonly ElektronskaOglasnaTablaContext _context;

        public AppConfigsController(ElektronskaOglasnaTablaContext context)
        {
            _context = context;
        }

        // GET: api/AppConfigs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppConfig>>> GetAppConfig()
        {
            return await _context.AppConfig.ToListAsync();
        }

        // GET: api/AppConfigs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AppConfig>> GetAppConfig(int id)
        {
            var appConfig = await _context.AppConfig.FindAsync(id);

            if (appConfig == null)
            {
                return NotFound();
            }

            return appConfig;
        }

        // PUT: api/AppConfigs/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PutAppConfig(int id, AppConfig appConfig)
        {
            if (id != appConfig.Id)
            {
                return BadRequest();
            }

            _context.Entry(appConfig).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppConfigExists(id))
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

        // POST: api/AppConfigs
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<AppConfig>> PostAppConfig(AppConfig appConfig)
        {
            _context.AppConfig.Add(appConfig);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAppConfig", new { id = appConfig.Id }, appConfig);
        }

        // DELETE: api/AppConfigs/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<AppConfig>> DeleteAppConfig(int id)
        {
            var appConfig = await _context.AppConfig.FindAsync(id);
            if (appConfig == null)
            {
                return NotFound();
            }

            _context.AppConfig.Remove(appConfig);
            await _context.SaveChangesAsync();

            return appConfig;
        }

        private bool AppConfigExists(int id)
        {
            return _context.AppConfig.Any(e => e.Id == id);
        }

        // GET: api/AppConfigs/getConfig
        [HttpGet("getConfig")]
        public async Task<ActionResult<AppConfig>> getConfig()
        {
            var appConfig = await _context.AppConfig.FirstOrDefaultAsync();

            if (appConfig == null)
            {
                return NotFound();
            }

            return appConfig;
        }
    }
}
