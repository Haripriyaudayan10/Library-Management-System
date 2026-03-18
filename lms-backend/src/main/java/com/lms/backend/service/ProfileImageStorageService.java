package com.lms.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class ProfileImageStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");
    private final Path uploadDir = Path.of("uploads", "profile-images");

    public String storeProfileImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Profile image file is required");
        }

        String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        String extension = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0 && dot < original.length() - 1) {
            extension = original.substring(dot + 1).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new RuntimeException("Only jpg, jpeg, png, webp files are allowed");
        }

        try {
            Files.createDirectories(uploadDir);
            String fileName = UUID.randomUUID() + "." + extension;
            Path target = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/profile-images/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store profile image", ex);
        }
    }
}
