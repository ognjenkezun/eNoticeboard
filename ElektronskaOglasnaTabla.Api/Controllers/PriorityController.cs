using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElektronskaOglasnaTabla.Domain.Models;

namespace ElektronskaOglasnaTabla.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PriorityController : ControllerBase
    {
        private readonly ElektronskaOglasnaTablaContext _context;

        public PriorityController(ElektronskaOglasnaTablaContext context)
        {
            _context = context;
        }

        // GET: api/Priority
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Priorities>>> GetPriorities()
        {
            return await _context.Priorities.ToListAsync();
        }

        // GET: api/Priority/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Priorities>> GetPriorities(int id)
        {
            var priorities = await _context.Priorities.FindAsync(id);

            if (priorities == null)
            {
                return NotFound();
            }

            return priorities;
        }

        // PUT: api/Priority/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPriorities(int id, Priorities priorities)
        {
            if (id != priorities.PriorityId)
            {
                return BadRequest();
            }

            _context.Entry(priorities).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PrioritiesExists(id))
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

        // POST: api/Priority
        [HttpPost]
        public async Task<ActionResult<Priorities>> PostPriorities(Priorities priorities)
        {
            _context.Priorities.Add(priorities);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPriorities", new { id = priorities.PriorityId }, priorities);
        }

        // DELETE: api/Priority/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Priorities>> DeletePriorities(int id)
        {
            var priorities = await _context.Priorities.FindAsync(id);
            if (priorities == null)
            {
                return NotFound();
            }

            _context.Priorities.Remove(priorities);
            await _context.SaveChangesAsync();

            return priorities;
        }

        private bool PrioritiesExists(int id)
        {
            return _context.Priorities.Any(e => e.PriorityId == id);
        }
    }
}
