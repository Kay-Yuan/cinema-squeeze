using Microsoft.AspNetCore.Mvc;


namespace CinemaSqueeze.Controllers
{
    public class MovieController : Controller
    {
        // GET: /movies or /movies/index
        public IActionResult Index()
        {
            // TODO: Replace with actual logic to get movies
            return View();
        }

        // GET: /movies/details/5
        public IActionResult Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            // TODO: Replace with actual logic to get a movie by id
            return View();
        }

        // Add other actions as needed (e.g., Create, Edit, Delete)
    }
}