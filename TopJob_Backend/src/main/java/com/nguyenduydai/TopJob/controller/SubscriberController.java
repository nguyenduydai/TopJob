
package com.nguyenduydai.TopJob.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nguyenduydai.TopJob.domain.entity.Subscriber;
import com.nguyenduydai.TopJob.domain.response.ResString;
import com.nguyenduydai.TopJob.domain.response.ResultPaginationDTO;
import com.nguyenduydai.TopJob.service.SubscriberService;
import com.nguyenduydai.TopJob.util.SecurityUtil;
import com.nguyenduydai.TopJob.util.annotation.ApiMessage;
import com.nguyenduydai.TopJob.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class SubscriberController {
    private final SubscriberService subscriberService;

    public SubscriberController(SubscriberService subscriberService) {
        this.subscriberService = subscriberService;
    }

    @PostMapping("/subscribers")
    @ApiMessage("create a Subscriber")
    public ResponseEntity<Subscriber> createSubscriber(@Valid @RequestBody Subscriber subscriber)
            throws IdInvalidException {
        if (this.subscriberService.isEmailExist(subscriber.getEmail())) {
            throw new IdInvalidException("Subscriber da ton tai");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(this.subscriberService.handleCreateSubscriber(subscriber));
    }

    @PutMapping("/subscribers")
    @ApiMessage("update Subscriber")
    public ResponseEntity<Subscriber> updateSubscriber(@Valid @RequestBody Subscriber postSubscriber)
            throws IdInvalidException {
        Subscriber currSubscriber = this.subscriberService.fetchSubscriberById(postSubscriber.getId());
        if (currSubscriber == null) {
            throw new IdInvalidException("Subscriber id = " + postSubscriber.getId() + "khong ton tai");
        }
        return ResponseEntity.status(HttpStatus.OK)
                .body(this.subscriberService.handleUpdateSubscriber(currSubscriber, postSubscriber));
    }

    @GetMapping("/subscribers/by-user")
    @ApiMessage("get Subscriber by user")
    public ResponseEntity<Subscriber> getSubscriberSkill()
            throws IdInvalidException {
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        return ResponseEntity.status(HttpStatus.OK)
                .body(this.subscriberService.findByEmail(email));
    }

    @GetMapping("/subscribers")
    @ApiMessage("fetch all subscribers")
    public ResponseEntity<ResultPaginationDTO> getAllEntitySubscriber(@Filter Specification<Subscriber> spec,
            Pageable pageable) {

        return ResponseEntity.ok(this.subscriberService.fetchAllSubscriber(spec, pageable));
    }

    @DeleteMapping("/subscribers/{id}")
    @ApiMessage("delete subscribers")
    public ResponseEntity<ResString> deleteSkilSubscriber(@PathVariable("id") long id) throws IdInvalidException {
        Subscriber currS = this.subscriberService.fetchSubscriberById(id);
        if (currS == null)
            throw new IdInvalidException("subscriber id = " + id + "khong ton tai");
        this.subscriberService.handleDeleteSubscriber(id);
        ResString res = new ResString("delete success");
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }
}
