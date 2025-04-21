
package com.nguyenduydai.TopJob.domain.response.email;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class ResEmailJob {
    private String name;
    private String salary;
    private String company;
    private List<SkillEmail> skills;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class SkillEmail {
        private String name;
    }

}
