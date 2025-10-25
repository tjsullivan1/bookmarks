# Platform Engineering Documentation Standards

## Overview
This document establishes standards for creating professional, reusable platform engineering documentation that avoids fictional elements and maintains real-world applicability.

## Team Assignment Guidelines

### ❌ NEVER USE Fictional Names
**Prohibited Examples:**
- Alex Chen, Jordan Martinez, Sam Taylor
- John Smith, Jane Doe, Bob Wilson
- Any made-up personal names

### ✅ ALWAYS USE Professional Placeholders

#### Option 1: Role-Based Assignees (RECOMMENDED)
Use descriptive role titles that reflect actual responsibilities:
```
- Senior Platform Engineer
- DevOps Engineer
- Full-Stack Developer
- Site Reliability Engineer
- Security Engineer
- Product Manager
- Scrum Master
```

#### Option 2: Generic Placeholders
When roles are not defined:
```
- Team Member 1
- Team Member 2
- Assignee A, Assignee B, Assignee C
```

#### Option 3: Placeholder Brackets
For templates to be filled later:
```
- [To be assigned]
- [Platform Engineer Name]
- [DevOps Lead Name]
```

#### Option 4: Leave Blank
For documentation that teams will customize:
```
| Assignee | [Empty field for team to fill] |
```

## Documentation Types and Standards

### Sprint Planning Documents
- **Capacity Planning**: Use role-based assignees with skill descriptions
- **Sprint Plans**: Use role-based assignees or placeholder brackets
- **Risk Registers**: Use role-based ownership assignments
- **Dependency Trackers**: Use role-based contact assignments

### User Stories and Epics
- **Acceptance Criteria**: Focus on role capabilities, not individual names
- **Task Assignments**: Use role-based assignees or leave for team assignment
- **Review Requirements**: Specify reviewer roles, not personal names

### Architecture Documentation
- **Decision Records (ADRs)**: Use role-based decision makers
- **Design Reviews**: Specify reviewer roles and expertise areas
- **Technical Specifications**: Use role-based implementation assignments

## Quality Assurance Checklist

Before publishing any platform engineering documentation, verify:

### ✅ Team Assignment Review
- [ ] No fictional personal names used anywhere in document
- [ ] All assignees use role-based titles or professional placeholders
- [ ] Team composition tables use generic role descriptions
- [ ] Capacity planning uses role-based skills assessment

### ✅ Professional Language
- [ ] Documentation sounds professional and realistic
- [ ] Examples use real technology names and versions
- [ ] Scenarios reflect actual platform engineering challenges
- [ ] Success metrics are measurable and achievable

### ✅ Reusability Standards
- [ ] Document can be used by any team without modification
- [ ] Role assignments can be easily mapped to actual team members
- [ ] Examples are technology-agnostic where appropriate
- [ ] Templates include clear customization instructions

## Implementation Guidelines

### For AI Assistants and Documentation Authors
When creating platform engineering documentation:

1. **Start with Role Definition**: Begin by identifying required roles based on actual work, not fictional team members

2. **Use Skill-Based Assignment**: Assign work based on required competencies, not arbitrary personal characteristics

3. **Maintain Professional Tone**: Write as if creating real documentation for actual implementation

4. **Enable Easy Customization**: Structure documents so teams can easily replace placeholders with actual names

5. **Focus on Outcomes**: Emphasize deliverables and success criteria rather than personality-based team dynamics

### For Teams Using Documentation
When adopting platform engineering templates:

1. **Map Roles to People**: Replace role-based assignees with actual team member names

2. **Adjust Capacity**: Modify capacity planning based on actual team member availability and skills

3. **Customize Skills**: Update skill matrices to reflect actual team member competencies

4. **Validate Assignments**: Ensure story and task assignments match real team capabilities

## Examples of Proper Usage

### ✅ GOOD: Capacity Planning Entry
```markdown
#### Senior Platform Engineer
- **Primary Responsibilities**: Terraform architecture, Azure infrastructure design
- **Secondary Skills**: Mentoring, code review
- **Capacity**: 20 story points
```

### ❌ BAD: Fictional Person Entry
```markdown
#### Alex Chen - Senior Platform Engineer
- **Primary Responsibilities**: Terraform architecture, Azure infrastructure design
- **Secondary Skills**: Mentoring, code review
- **Capacity**: 20 story points
```

### ✅ GOOD: Sprint Task Assignment
```markdown
| Task | Assignee | Duration |
|------|----------|----------|
| Terraform Module Design | Senior Platform Engineer | 8h |
| CI/CD Pipeline Setup | DevOps Engineer | 12h |
```

### ❌ BAD: Fictional Assignment
```markdown
| Task | Assignee | Duration |
|------|----------|----------|
| Terraform Module Design | Alex Chen | 8h |
| CI/CD Pipeline Setup | Jordan Martinez | 12h |
```

## Enforcement and Review

### Documentation Review Process
1. **Author Self-Check**: Use quality assurance checklist before submission
2. **Peer Review**: Verify professional standards and reusability
3. **Team Lead Approval**: Ensure documentation meets organizational standards

### Continuous Improvement
- Regularly review documentation standards based on team feedback
- Update templates to reflect evolving platform engineering practices
- Maintain examples that reflect current technology stacks and methodologies

## Benefits of These Standards

### For Teams
- **Immediate Usability**: Documentation ready for real-world implementation
- **Professional Quality**: Maintains organizational credibility and standards
- **Easy Customization**: Clear mapping from roles to actual team members

### For Organizations
- **Consistency**: Standardized approach across all platform engineering initiatives
- **Scalability**: Templates work for teams of different sizes and compositions
- **Knowledge Transfer**: New team members can understand roles and responsibilities

### For Platform Engineering Practice
- **Best Practice Sharing**: Documentation can be shared across organizations
- **Community Contribution**: Standards enable contribution to open-source platform engineering resources
- **Professional Development**: Maintains high standards for platform engineering discipline

---

**Key Principle**: Platform engineering documentation should be professional, practical, and immediately applicable to real-world scenarios without requiring fictional elements or placeholder personalities.
