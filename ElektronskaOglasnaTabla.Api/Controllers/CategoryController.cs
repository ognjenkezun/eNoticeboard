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
using Microsoft.AspNetCore.Identity;

namespace ElektronskaOglasnaTabla.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ElektronskaOglasnaTablaContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public CategoryController(ElektronskaOglasnaTablaContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Category
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categories>>> GetCategories()
        {
            return await _context.Categories.OrderBy(x => x.PriorityId).ToListAsync();
        }

        // GET: api/Category/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Categories>> GetCategories(int id)
        {
            var categories = await _context.Categories.FindAsync(id);

            if (categories == null)
            {
                return NotFound();
            }

            return categories;
        }

        // PUT: api/Category/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PutCategories(int id, Categories categories)
        {
            if (id != categories.CategoryId)
            {
                return BadRequest();
            }

            _context.Entry(categories).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoriesExists(id))
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

        // POST: api/Category
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Categories>> PostCategories(Categories categories)
        {
            _context.Categories.Add(categories);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategories", new { id = categories.CategoryId }, categories);
        }

        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Categories>> DeleteCategories(int id)
        {
            var categories = await _context.Categories.FindAsync(id);
            if (categories == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(categories);
            await _context.SaveChangesAsync();

            return categories;
        }

        private bool CategoriesExists(int id)
        {
            return _context.Categories.Any(e => e.CategoryId == id);
        }

        // GET: api/Category/CategoriesDetails
        [HttpGet("CategoriesDetails")]
        //[Authorize(Roles = "Administrator")]
        public ActionResult<IEnumerable<CategoriesDetails>> GetCategoriesDetails()
        {
            var category = _context.Categories.OrderBy(x => x.PriorityId).ToList();

            var categoryResultList = new List<CategoriesDetails>();

            category.ForEach(cat => {
                var res = new CategoriesDetails();

                res.CategoryId = cat.CategoryId;
                res.CategoryName = cat.CategoryName;
                res.PriorityId = cat.PriorityId;

                var resIt = _context.Priorities.FirstOrDefault(x => x.PriorityId == cat.PriorityId);
                res.PriorityValue = resIt.PriorityValue;

                categoryResultList.Add(res);
            });

            return categoryResultList;
        }

        // GET: api/Category/CategoriesWithAnnouncements
        [HttpGet("CategoriesWithAnnouncements/{numberOfAnnouncement}")]
        //[Authorize(Roles = "Administrator")]
        public ActionResult<IEnumerable<CategoriesDetails>> GetCategoriesWithAnnouncements(int numberOfAnnouncement)
        {
            var categoryResultList = new List<CategoriesDetails>();
            var category = _context.Categories.OrderBy(x => x.PriorityId).ToList();

            category.ForEach(cat => {
                var res = new CategoriesDetails();

                res.CategoryId = cat.CategoryId;
                res.CategoryName = cat.CategoryName;

                res.PriorityId = cat.PriorityId;
                var priority = _context.Priorities.FirstOrDefault(x => x.PriorityId == cat.PriorityId);
                res.PriorityValue = priority.PriorityValue;

                var announcementDetailsList = _context.Announcements.Where(x => x.CategoryId == cat.CategoryId)
                                                                    .ToList();

                var filteredAnnouncementDetailsList = announcementDetailsList.OrderByDescending(x => x.AnnouncementDateCreated)
                                                                             .OrderByDescending(x => x.AnnouncementDateModified)
                                                                             .OrderByDescending(x => x.AnnouncementImportantIndicator)
                                                                             .Take(numberOfAnnouncement)
                                                                             .ToList();

                filteredAnnouncementDetailsList.ForEach(ann => {
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
                    resultItem.CategoryName = cat.CategoryName;

                    //Prioritet
                    resultItem.PriorityId = cat.PriorityId;
                    resultItem.PriorityValue = priority.PriorityValue;

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

                    res.Announcements.Add(resultItem);
                });

                categoryResultList.Add(res);
            });

            return categoryResultList;
        }

        // GET: api/Category/numberOfCategories
        [HttpGet("numberOfCategories")]
        public int GetCategoriesLenght()
        {
            return _context.Categories.Count();
        }

        // GET: api/Category/categoryDetails/1&5
        [HttpGet("categoryDetails/{page}&{pageSize}")]
        public IEnumerable<CategoriesDetails> GetCategoryDetails(int page, int pageSize)
        {
            var category = _context.Categories.OrderBy(x => x.PriorityId)
                                              .Skip((page - 1) * pageSize)
                                              .Take(pageSize)
                                              .ToList(); ;

            var categoryResultList = new List<CategoriesDetails>();

            category.ForEach(cat => {

                var res = new CategoriesDetails();

                res.CategoryId = cat.CategoryId;
                res.CategoryName = cat.CategoryName;
                res.PriorityId = cat.PriorityId;

                var resIt = _context.Priorities.FirstOrDefault(x => x.PriorityId == cat.PriorityId);
                res.PriorityValue = resIt.PriorityValue;

                categoryResultList.Add(res);
            });

            return categoryResultList;
        }
    }
}
