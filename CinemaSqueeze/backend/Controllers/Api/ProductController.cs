using Microsoft.AspNetCore.Mvc;
using CinemaSqueeze.DTOs;  // Ensure this is the correct namespace for your models

namespace CinemaSqueeze.Controllers.Api;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    // Sample in-memory data
    private static List<Product> _products = new List<Product>
    {
        new Product { Id = 1, Name = "Product1", Price = 10.99m },
        new Product { Id = 2, Name = "Product2", Price = 12.99m },
        new Product { Id = 3, Name = "Product3", Price = 8.99m }
    };

    // GET api/product
    [HttpGet]
    public ActionResult<IEnumerable<Product>> Get()
    {
        return Ok(_products);  // Returns all products
    }

    // GET api/product/5
    [HttpGet("{id}")]
    public ActionResult<Product> Get(int id)
    {
        var product = _products.FirstOrDefault(p => p.Id == id);
        if (product == null)
        {
            return NotFound();  // Return 404 if not found
        }

        return Ok(product);  // Return the product if found
    }

    // POST api/product
    [HttpPost]
    public ActionResult<Product> Post([FromBody] Product product)
    {
        _products.Add(product);
        return CreatedAtAction(nameof(Get), new { id = product.Id }, product);  // 201 Created
    }

    // PUT api/product/5
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] Product product)
    {
        var existingProduct = _products.FirstOrDefault(p => p.Id == id);
        if (existingProduct == null)
        {
            return NotFound();
        }

        existingProduct.Name = product.Name;
        existingProduct.Price = product.Price;

        return NoContent();  // Return 204 No Content
    }

    // DELETE api/product/5
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var product = _products.FirstOrDefault(p => p.Id == id);
        if (product == null)
        {
            return NotFound();
        }

        _products.Remove(product);
        return NoContent();  // Return 204 No Content
    }
}
