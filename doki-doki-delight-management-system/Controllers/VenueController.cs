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
    [Route("api/venue")]
    [ApiController]
    public class VenueController : ControllerBase
    {
        // GET: api/<VenueController>
        [HttpGet]
        public IEnumerable<Venue> Get()
        {
            return VenueService.GetData().ToArray();
        }

        // POST api/<VenueController>
        [HttpPost]
        public void Post([FromBody] Venue venue)
        {
            VenueService service = new VenueService();
            VenueService.PushData(venue);
        }

    }
}
