package com.HealthcareManagement.Controller;

import com.HealthcareManagement.Model.Receptionist;
import com.HealthcareManagement.Model.UserDTO;
import com.HealthcareManagement.Service.ReceptionistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.POST}, allowCredentials = "true")
@RequestMapping("/receptionist")
public class ReceptionistController {

    @Autowired
    ReceptionistService receptionistService;

    @PutMapping("/auth/updateReceptionistProfile/{userId}")
    @PreAuthorize("hasAuthority('Receptionist')")
    public ResponseEntity<String> UpdateProfile(@PathVariable Long userId, @RequestBody UserDTO userDTO, @RequestHeader("Authorization") String authHeader){
        try{
            return receptionistService.updateprofile(userId,userDTO);
        }catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping("/auth/bookAppointment")
    @PreAuthorize("hasAuthority('Receptionist')")
    public ResponseEntity<String> BookAppointment( @RequestBody UserDTO userDTO, @RequestHeader("Authorization") String authHeader){
        try{
            return receptionistService.bookAppointment(userDTO);
        }catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }
}
