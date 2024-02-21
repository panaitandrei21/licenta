package com.licenta.StuddyBuddy.model;

import com.licenta.StuddyBuddy.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@Setter
public class Teacher{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String teacherId;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

}
