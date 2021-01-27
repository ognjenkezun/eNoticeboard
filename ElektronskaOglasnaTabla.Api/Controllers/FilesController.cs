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
    public class FilesController : ControllerBase
    {
        private readonly ElektronskaOglasnaTablaContext _context;

        public FilesController(ElektronskaOglasnaTablaContext context)
        {
            _context = context;
        }

        // GET: api/Files
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Files>>> GetFiles()
        {
            return await _context.Files.ToListAsync();
        }

        // GET: api/Files/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Files>> GetFiles(int id)
        {
            var files = await _context.Files.FindAsync(id);

            if (files == null)
            {
                return NotFound();
            }

            return files;
        }

        // GET: api/Files/5
        [HttpGet("filesForAnnouncement/{announcementId}")]
        public async Task<ActionResult<IEnumerable<Files>>> GetFilesForAnnouncement(int announcementId)
        {
            return await _context.Files.Where(x => x.AnnouncementId == announcementId).ToListAsync();
        }

        // PUT: api/Files/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFiles(int id, Files files)
        {
            if (id != files.FileId)
            {
                return BadRequest();
            }

            _context.Entry(files).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FilesExists(id))
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

        // POST: api/Files
        [HttpPost]
        public async Task<ActionResult<Files>> PostFiles(List<Files> files)
        {
            var basePath = "http://localhost:5000/Resources/Files/";
            files.ForEach(
                file =>
                {
                    basePath += file.FilePath;
                    file.FilePath = "";
                    file.FilePath = basePath;
                    _context.Files.Add(file);
                    basePath = "http://localhost:5000/Resources/Files/";
                }
            );
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFiles", files);
        }

        // DELETE: api/Files/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Files>> DeleteFiles(int id)
        {
            var files = await _context.Files.FindAsync(id);
            if (files == null)
            {
                return NotFound();
            }

            _context.Files.Remove(files);
            await _context.SaveChangesAsync();

            return files;
        }

        private bool FilesExists(int id)
        {
            return _context.Files.Any(e => e.FileId == id);
        }
    }
}
