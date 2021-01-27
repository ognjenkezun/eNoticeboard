using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ElektronskaOglasnaTabla.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private IHostingEnvironment _hostingEnvironment;

        public FileController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost, DisableRequestSizeLimit]
        [Route("uploadFiles")]
        public async Task<IActionResult> UploadFile()
        {
            try
            {
                var files = Request.Form.Files;
                var folderName = Path.Combine("Resources", "Files");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                //if (files.Any(f => f.Length == 0))
                //{
                //    return BadRequest();
                //}

                foreach (var file in files)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPah = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                }

                return Ok("All files are successfully uploaded");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet]
        [Route("downloadFile/{filename}")]
        public async Task<IActionResult> DownloadFile(string filename)
        {
            if (filename == null)
            {
                return Content("Filename not present.");
            }

            var path = Path.Combine(Directory.GetCurrentDirectory(), "Resources\\Files", filename);

            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(path), Path.GetFileName(path));
        }

        [HttpGet]
        [Route("getFiles")]
        public IActionResult GetFiles()
        {
            var baseUrl = "http://localhost:5000/Resources/Files/";
            var result = new List<string>();

            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "Resources\\Files");
            if(Directory.Exists(uploads))
            {
                foreach (string filePath in Directory.GetFiles(uploads))
                {
                    var filename = Path.GetFileName(filePath);
                    result.Add(baseUrl + filename);
                }
            }

            return Ok(result);
        }

        [HttpGet]
        [Route("getFilesName")]
        public IActionResult GetFilesName()
        {
            var result = new List<string>();

            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "Resources\\Files");
            if (Directory.Exists(uploads))
            {
                foreach (string filePath in Directory.GetFiles(uploads))
                {
                    var filename = Path.GetFileName(filePath);
                    result.Add(filename);
                }
            }

            return Ok(result);
        }

        [HttpPost, DisableRequestSizeLimit]
        [Route("uploadImages/{announcementId}")]
        public async Task<IActionResult> UploadImages(int announcementId)
        {
            try
            {
                var files = Request.Form.Files;
                Console.Write("Files =====> ", files);
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                //if (files.Any(f => f.Length == 0))
                //{
                //    return BadRequest();
                //}

                foreach (var file in files)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPah = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                }

                return Ok("All files are successfully uploaded");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet]
        [Route("downloadImage/{filename}")]
        public async Task<IActionResult> DownloadImage(string filename)
        {
            if (filename == null)
            {
                return Content("Filename not present.");
            }

            var path = Path.Combine(Directory.GetCurrentDirectory(), "Resources\\Images", filename);

            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(path), Path.GetFileName(path));
        }

        [HttpGet]
        [Route("getImages")]
        public IActionResult GetImages()
        {
            var baseUrl = "http://localhost:5000/Resources/Images/";
            var result = new List<string>();
            
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "Resources\\Images");
            if (Directory.Exists(uploads))
            {
                foreach (string filePath in Directory.GetFiles(uploads))
                {
                    var filename = Path.GetFileName(filePath);
                    result.Add(baseUrl + filename);
                }
            }

            return Ok(result);
        }

        private string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }

        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"}
            };
        }
    }
}