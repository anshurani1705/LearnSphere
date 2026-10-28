package com.skillforge.lms.dto.quiz;

import com.skillforge.lms.entity.AnswerOption;
import com.skillforge.lms.entity.Quiz;
import com.skillforge.lms.entity.QuizQuestion;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
public class QuizDto {
    private Long id;
    private Long courseId;
    private Long lessonId;
    private String title;
    private String description;
    private int passingScore;
    private Integer timeLimitMinutes;
    private boolean required;
    private List<QuestionDto> questions = new ArrayList<>();

    public QuizDto() {
    }

    @Builder
    public QuizDto(Long id, Long courseId, Long lessonId, String title, String description,
                   int passingScore, Integer timeLimitMinutes, boolean required, List<QuestionDto> questions) {
        this.id = id;
        this.courseId = courseId;
        this.lessonId = lessonId;
        this.title = title;
        this.description = description;
        this.passingScore = passingScore;
        this.timeLimitMinutes = timeLimitMinutes;
        this.required = required;
        this.questions = questions != null ? questions : new ArrayList<>();
    }

    @Getter @Setter
    public static class QuestionDto {
        private Long id;
        private String questionText;
        private String questionType;
        private int points;
        private List<OptionDto> options;

        public QuestionDto() {
        }

        @Builder
        public QuestionDto(Long id, String questionText, String questionType, int points, List<OptionDto> options) {
            this.id = id;
            this.questionText = questionText;
            this.questionType = questionType;
            this.points = points;
            this.options = options;
        }
    }

    @Getter @Setter
    public static class OptionDto {
        private Long id;
        private String optionText;

        public OptionDto() {
        }

        @Builder
        public OptionDto(Long id, String optionText) {
            this.id = id;
            this.optionText = optionText;
        }
    }

    public static QuizDto fromEntity(Quiz quiz) {
        List<QuestionDto> questionDtos = new ArrayList<>();
        if (quiz.getQuestions() != null) {
            for (QuizQuestion q : quiz.getQuestions()) {
                List<OptionDto> optionDtos = new ArrayList<>();
                if (q.getOptions() != null) {
                    for (AnswerOption opt : q.getOptions()) {
                        optionDtos.add(new OptionDto(opt.getId(), opt.getOptionText()));
                    }
                }
                questionDtos.add(QuestionDto.builder()
                        .id(q.getId())
                        .questionText(q.getQuestionText())
                        .questionType(q.getQuestionType() != null ? q.getQuestionType().name() : "SINGLE_CHOICE")
                        .points(q.getPoints())
                        .options(optionDtos)
                        .build());
            }
        }

        return QuizDto.builder()
                .id(quiz.getId())
                .courseId(quiz.getCourse() != null ? quiz.getCourse().getId() : null)
                .lessonId(quiz.getLesson() != null ? quiz.getLesson().getId() : null)
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .passingScore(quiz.getPassingScore())
                .timeLimitMinutes(quiz.getTimeLimitMinutes())
                .required(quiz.isRequired())
                .questions(questionDtos)
                .build();
    }
}
