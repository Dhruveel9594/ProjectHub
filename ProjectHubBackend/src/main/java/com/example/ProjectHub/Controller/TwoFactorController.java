package com.example.ProjectHub.Controller;

import com.example.ProjectHub.Service.TwoFactorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/2fa")
public class TwoFactorController {

    @Autowired
    private TwoFactorService twoFactorService;

    // ── Step 1: Start 2FA setup ──
    // Returns: QR code image (base64) + secret key
    // User scans QR code with Google Authenticator / Authy
    @PostMapping("/setup")
    public ResponseEntity<?> setup() {
        try {
            return ResponseEntity.ok(twoFactorService.setupTwoFactor());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Step 2: Confirm setup with first code ──
    // User enters 6-digit code from their authenticator app
    // Body: { "code": 123456 }
    @PostMapping("/setup/confirm")
    public ResponseEntity<?> confirmSetup(@RequestBody Map<String, Integer> body) {
        try {
            Integer code = body.get("code");
            if (code == null) {
                return ResponseEntity.badRequest().body("Code is required");
            }
            twoFactorService.confirmSetup(code);
            return ResponseEntity.ok(Map.of(
                    "message", "2FA enabled successfully",
                    "enabled", true
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Disable 2FA ──
    // User must provide current code to disable
    // Body: { "code": 123456 }
    @PostMapping("/disable")
    public ResponseEntity<?> disable(@RequestBody Map<String, Integer> body) {
        try {
            Integer code = body.get("code");
            if (code == null) {
                return ResponseEntity.badRequest().body("Code is required");
            }
            twoFactorService.disableTwoFactor(code);
            return ResponseEntity.ok(Map.of(
                    "message", "2FA disabled successfully",
                    "enabled", false
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}