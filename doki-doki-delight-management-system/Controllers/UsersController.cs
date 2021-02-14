using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using doki_doki_delight_management_system.Models;
using doki_doki_delight_management_system.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace doki_doki_delight_management_system.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // GET: api/<DataController>
        [HttpGet]
        public IEnumerable<User> Get()
        {
            return UsersService.GetData().ToArray();
        }

        // POST api/<DataController>
        [HttpPost]
        public void Post([FromBody] User user)
        {
            // Create a new instance of UsersService so that I can reuse the SetID method to generate a unique ID for the POST form data
            UsersService service = new UsersService();
            user.UserID = service.SetUserID();
            UsersService.PushData(user);
        }
    }
}
