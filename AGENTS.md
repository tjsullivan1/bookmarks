# Agent Context and Guidance File

This file provides guidance to Coding Agents/Assistants when working with code in this repository.  It is meant as a universal way to help and guide AI/LLM Agents based on [Agents.md](https://agents.md).

- **Audience**: Platform Engineers, SREs, Security/QA Engineers, and AI Assistants operating on this repo.
- **Scope**: Azure-centric, cloud-native, spec-driven development for Internal Developer Platforms (IDPs).
- **Golden rule**: Specification first. **No production-impacting change** occurs without human approval.

## Repository Overview

This is an advanced Platform Engineering toolkit that implements comprehensive **spec-driven development** for building Internal Developer Platforms (IDPs). The repository provides a complete workflow system with specialized agent personas, automated quality gates, and continuous improvement capabilities for **Azure** environments.

## Enhanced Spec-Driven Development System

This repository implements a complete spec-driven development methodology that transforms how platform engineering teams deliver value:

### Core Philosophy
- **Specification First**: All work begins with clear, validated specifications.
- **AI-Enhanced Workflows**: Specialized AI agents guide each phase of development.
- **Quality by Design**: Automated quality gates ensure consistent excellence.
- **Continuous Learning**: Systematic capture and application of lessons learned.
- **Data-Driven Optimization**: Metrics and analytics drive continuous improvement.

## Architecture & Directory Structure

### Core Components
- **Specialized Chat Modes**: Six role-based AI agents for different aspects of platform engineering
- **Workflow Phase Commands**: Seven-stage development lifecycle with AI guidance
- **Agile Integration**: Complete agile/scrum workflow with AI-assisted planning
- **Quality Assurance**: Automated quality gates and validation frameworks
- **Continuous Improvement**: Metrics, optimization, and learning systems

### Enhanced Directory Structure
```
.platform-mode/
├── standards/          # Organizational standards and best practices
├── epics/             # Epic definitions with acceptance criteria
├── stories/           # User stories with detailed acceptance criteria
├── sprints/           # Sprint planning and execution artifacts
├── tasks/             # Granular task breakdowns and management
├── validation/        # Quality gates, test specs, and DoD checklists
├── retrospectives/    # Sprint retrospectives and improvement actions
├── workflows/         # Orchestrated command sequences
├── metrics/           # Performance dashboards and analytics
├── optimization/      # Process improvement recommendations
└── knowledge/         # Lessons learned and organizational knowledge
```

## Comprehensive Command System

### Workflow Phase Commands (Complete Development Lifecycle)
- `/discovery` - User research, problem analysis, stakeholder interviews
- `/analysis` - Requirements gathering, constraint identification, validation
- `/design` - Architecture, system design, technology selection with ADRs
- `/plan` - Sprint planning, story breakdown, capacity planning
- `/execute` - Implementation with automated validation and quality gates
- `/validate` - Testing, acceptance criteria verification, production readiness
- `/retrospect` - Lessons learned, process improvement, team development

### Specialized Agent Personas (Role-Based Expertise)
Switch to specialized modes for focused expertise:
- **Product Manager Mode**: Requirements gathering, stakeholder management, value prioritization
- **Platform Architect Mode**: System design, technology decisions, architectural governance
- **DevOps Engineer Mode**: Infrastructure automation, CI/CD, operational excellence
- **Security Engineer Mode**: Security architecture, compliance, threat modeling
- **QA Engineer Mode**: Testing strategies, quality assurance, validation frameworks
- **Scrum Master Mode**: Agile facilitation, impediment removal, team optimization

### Agile Integration Commands (Complete Scrum Implementation)
- `/epic` - Create comprehensive epics with acceptance criteria and story breakdown
- `/story` - Generate detailed user stories with Given-When-Then acceptance criteria
- `/sprint-plan` - Comprehensive sprint planning with capacity and dependency management
- `/estimate` - AI-assisted story point estimation with confidence levels and rationale
- `/definition-of-done` - Generate DoD checklists for story, sprint, and release levels

### Advanced Task Management (Systematic Work Organization)
- `/task-breakdown` - Decompose stories into detailed implementation tasks
- `/dependency-map` - Visualize task dependencies with critical path analysis
- `/progress-track` - Real-time sprint progress monitoring with predictive insights
- `/blockers` - Identify and escalate impediments with resolution strategies

### Quality Gates & Validation (Automated Quality Assurance)
- `/spec-review` - Comprehensive specification review for architectural compliance
- `/acceptance-test` - Generate test cases from acceptance criteria with automation guidance
- `/quality-gate` - Create automated quality checkpoints with CI/CD integration
- `/demo-prep` - Prepare compelling sprint demos with stakeholder engagement

### Continuous Improvement (Data-Driven Optimization)
- `/metrics-dashboard` - Team performance insights with predictive analytics
- `/process-optimize` - Data-driven workflow improvements with implementation roadmaps
- `/lessons-learned` - Systematic knowledge capture and organizational learning

### Infrastructure as Code (Terraform Specialization)
- `/terraform` - Design and implement infrastructure as code following platform engineering best practices

## Workflow Usage Patterns

### Complete Feature Development Lifecycle
1. **Discovery Phase**: Use `/discovery` to understand user needs and problem space
2. **Analysis Phase**: Use `/analysis` to gather detailed requirements and constraints
3. **Design Phase**: Use `/design` to create architecture and technical specifications
4. **Planning Phase**: Use `/plan` to create sprint plans and story breakdowns
5. **Execution Phase**: Use `/execute` with quality gates for implementation
6. **Validation Phase**: Use `/validate` and `/acceptance-test` for comprehensive testing
7. **Retrospection Phase**: Use `/retrospect` and `/lessons-learned` for continuous improvement

### Agile Sprint Management
- **Epic Creation**: Use `/epic` to define large initiatives with clear business value
- **Story Development**: Use `/story` for detailed user stories with acceptance criteria
- **Sprint Planning**: Use `/sprint-plan` for capacity planning and commitment
- **Task Management**: Use `/task-breakdown` and `/dependency-map` for detailed execution
- **Progress Monitoring**: Use `/progress-track` and `/blockers` for real-time insights
- **Sprint Demos**: Use `/demo-prep` for stakeholder engagement
- **Improvement**: Use `/retrospect` for team development and process optimization

### Quality Assurance Integration
- **Specification Review**: Use `/spec-review` before implementation begins
- **Quality Gates**: Use `/quality-gate` to define automated quality checkpoints
- **Test Generation**: Use `/acceptance-test` to create comprehensive test suites
- **Definition of Done**: Use `/definition-of-done` for consistent completion criteria

### Continuous Improvement Cycle
- **Performance Analysis**: Use `/metrics-dashboard` for team and process insights
- **Process Optimization**: Use `/process-optimize` for systematic workflow improvements
- **Knowledge Management**: Use `/lessons-learned` to capture and apply organizational learning

## Terraform Module Development

When creating Terraform modules:
- Follow file organization pattern: `00-variables.tf`, `01-main.tf`, `02-outputs.tf`, `locals.tf`, `data.tf`, `providers.tf`, `versions.tf`
- Use naming convention: `${var.environment}_${var.project}_${resource_type}`
- Always include comprehensive variable validation and descriptions
- Reference `.platform-mode/standards/terraform.md` for complete coding standards
- **Critical**: Always ask clarifying questions before writing Terraform code if requirements are ambiguous
- Store modules in `catalog/terraform_modules/%module_name%/` directory

## Platform Engineering Principles

When working on platform engineering tasks, follow these core principles:
1. **Platform as Product**: Treat platforms as products with clear user personas and feedback loops
2. **Self-Service Enablement**: Enable self-service through golden paths and opinionated defaults
3. **Common Problem Focus**: Focus on solving shared problems across development teams
4. **Cognitive Load Reduction**: Reduce cognitive load through abstraction and consistent interfaces
5. **Build vs Buy**: Leverage existing tools rather than building from scratch
6. **Developer Experience**: Prioritize developer experience and productivity
7. **Progressive Disclosure**: Design systems that are simple for beginners, powerful for experts

## Advanced Features

### AI-Enhanced Development
- **Specialized Agents**: Six role-based AI personas provide focused expertise for different aspects of platform engineering
- **Predictive Analytics**: AI-powered insights for sprint completion probability, risk assessment, and performance optimization
- **Pattern Recognition**: Automated identification of success patterns, failure patterns, and improvement opportunities
- **Intelligent Recommendations**: Context-aware suggestions for process improvements and optimization

### Integration Capabilities
- **CI/CD Integration**: Quality gates integrate with GitHub Actions, Azure DevOps, and other CI/CD platforms
- **Metrics Integration**: Dashboards connect to Jira, GitHub, SonarQube, and other development tools
- **Knowledge Management**: Lessons learned system builds searchable organizational knowledge base
- **Workflow Orchestration**: Commands can be chained together for complex, multi-step processes

### Quality Assurance Framework
- **Automated Quality Gates**: Configurable quality checkpoints with customizable thresholds
- **Comprehensive Testing**: Test case generation from acceptance criteria with automation guidance
- **Specification Review**: Systematic review process ensuring architectural compliance
- **Definition of Done**: Multi-level DoD (story, sprint, release, epic) for consistent quality

## Success Metrics & Benefits

Teams using this spec-driven development system typically experience:
- **30-40% reduction** in rework through better specifications
- **Improved velocity** through AI-assisted task breakdown and estimation
- **Higher code quality** with systematic validation and quality gates
- **Better stakeholder alignment** through structured workflows and demos
- **Accelerated team development** with role-based AI guidance
- **Reduced cognitive load** through automation and systematic processes

## Getting Started

1. **Choose Your Role**: Select the appropriate specialized agent mode for your current work
2. **Start with Discovery**: Begin new initiatives with `/discovery` to understand the problem space
3. **Follow the Workflow**: Use the seven-phase workflow commands for systematic development
4. **Implement Quality Gates**: Set up automated quality checkpoints for consistent excellence
5. **Measure and Improve**: Use metrics and retrospectives for continuous optimization

## Important Notes

- This repository implements a complete **spec-driven development methodology** for platform engineering
- The system supports **Azure-based reference architectures** and cloud-native workflows
- **Six specialized AI agent personas** provide role-based expertise and guidance
- **Comprehensive quality gates** ensure consistent excellence throughout development
- **Systematic knowledge capture** builds organizational learning capabilities
- **Data-driven optimization** enables continuous process improvement
- All workflows integrate with modern development tools and practices
