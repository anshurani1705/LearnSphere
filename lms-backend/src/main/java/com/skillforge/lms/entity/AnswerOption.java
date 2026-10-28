package com.skillforge.lms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "answer_options")
@Getter @Setter
public class AnswerOption {

    public AnswerOption() {
    }

    @Builder
    public AnswerOption(Long id, QuizQuestion question, String optionText, boolean correct, int sortOrder) {
        this.id = id;
        this.question = question;
        this.optionText = optionText;
        this.correct = correct;
        this.sortOrder = sortOrder;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private QuizQuestion question;

    @Column(name = "option_text", nullable = false, columnDefinition = "TEXT")
    private String optionText;

    @Column(name = "is_correct")
    private boolean correct;

    @Column(name = "sort_order")
    private int sortOrder;
}
