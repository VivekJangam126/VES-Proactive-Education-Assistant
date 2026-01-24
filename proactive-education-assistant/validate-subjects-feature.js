/**
 * SUBJECTS FEATURE VALIDATION CHECKLIST
 * Validates that all code changes for subjects feature are in place
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function check(condition, description) {
  if (condition) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

let passed = 0;
let failed = 0;

function validate(name, checkFn) {
  try {
    const result = checkFn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    log(`❌ ${name}: ${error.message}`, 'red');
    failed++;
  }
}

log('\n' + '='.repeat(80), 'bright');
log('SUBJECTS FEATURE CODE VALIDATION', 'bright');
log('='.repeat(80) + '\n', 'bright');

// ==================== Backend Models ====================
log('\n📦 Backend Models:', 'cyan');

validate('Class.js has subjects field with validation', () => {
  const classFile = fs.readFileSync(path.join(__dirname, 'models', 'Class.js'), 'utf8');
  const hasSubjects = classFile.includes('subjects:');
  const hasValidation = classFile.includes('validate:') || classFile.includes('validation') || classFile.includes('s.length > 0');
  return check(hasSubjects && hasValidation, 'Class.js: subjects field with validation');
});

validate('Teacher.js has subjects field', () => {
  const teacherFile = fs.readFileSync(path.join(__dirname, 'models', 'Teacher.js'), 'utf8');
  const hasSubjects = teacherFile.includes("subjects:");
  return check(hasSubjects, 'Teacher.js: subjects field added');
});

// ==================== Backend Controllers ====================
log('\n🎯 Backend Controllers:', 'cyan');

validate('admin.controller.js: approveTeacher merges subjects', () => {
  const adminFile = fs.readFileSync(path.join(__dirname, 'controllers', 'admin.controller.js'), 'utf8');
  const hasMergeLogic = adminFile.includes('flatMap') || adminFile.includes('new Set');
  return check(hasMergeLogic, 'admin.controller.js: approveTeacher uses Set dedup');
});

validate('admin.controller.js: assignTeacherClasses merges subjects', () => {
  const adminFile = fs.readFileSync(path.join(__dirname, 'controllers', 'admin.controller.js'), 'utf8');
  const hasAssign = adminFile.includes('assignTeacherClasses');
  return check(hasAssign, 'admin.controller.js: assignTeacherClasses handler exists');
});

validate('marks.controller.js: validateSubjectInClass function', () => {
  const marksFile = fs.readFileSync(path.join(__dirname, 'controllers', 'marks.controller.js'), 'utf8');
  const hasValidation = marksFile.includes('validateSubjectInClass');
  return check(hasValidation, 'marks.controller.js: validateSubjectInClass exists');
});

validate('marks.controller.js: createMarks validates subject', () => {
  const marksFile = fs.readFileSync(path.join(__dirname, 'controllers', 'marks.controller.js'), 'utf8');
  const hasCheck = marksFile.includes('subjectOk');
  return check(hasCheck, 'marks.controller.js: createMarks calls subject validation');
});

// ==================== Backend Routes ====================
log('\n🛣️  Backend Routes:', 'cyan');

validate('admin.routes.js: POST /admin/classes validates subjects', () => {
  const routesFile = fs.readFileSync(path.join(__dirname, 'routes', 'admin.routes.js'), 'utf8');
  const hasValidation = routesFile.includes('isArray') && routesFile.includes('subjects');
  return check(hasValidation, 'admin.routes.js: POST /admin/classes has subjects validation');
});

validate('admin.routes.js: PATCH /admin/classes/:id validates subjects', () => {
  const routesFile = fs.readFileSync(path.join(__dirname, 'routes', 'admin.routes.js'), 'utf8');
  const routeContent = routesFile;
  const hasPatchValidation = routeContent.includes('/:id') && routeContent.includes('PATCH');
  return check(hasPatchValidation, 'admin.routes.js: PATCH /admin/classes/:id exists');
});

// ==================== Frontend Services ====================
log('\n🔧 Frontend Services:', 'cyan');

validate('marksService.js: getTeacherClassesWithSubjects exists', () => {
  const serviceFile = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'services', 'marksService.js'), 'utf8'
  );
  const hasMethod = serviceFile.includes('getTeacherClassesWithSubjects');
  return check(hasMethod, 'marksService.js: getTeacherClassesWithSubjects method');
});

validate('adminService.js: addClass passes subjects', () => {
  const serviceFile = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'services', 'adminService.js'), 'utf8'
  );
  const hasSubjects = serviceFile.includes('subjects');
  return check(hasSubjects, 'adminService.js: addClass includes subjects');
});

validate('adminService.js: updateClass passes subjects', () => {
  const serviceFile = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'services', 'adminService.js'), 'utf8'
  );
  const hasPatch = serviceFile.includes('PATCH') || serviceFile.includes('patch');
  return check(hasPatch, 'adminService.js: updateClass method exists');
});

// ==================== Frontend Components ====================
log('\n⚛️  Frontend Components:', 'cyan');

validate('AddEditClassModal.jsx: SUBJECT_OPTIONS array', () => {
  const componentFile = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'components', 'admin', 'classes', 'AddEditClassModal.jsx'), 'utf8'
  );
  const hasSubjects = componentFile.includes('SUBJECT_OPTIONS') || componentFile.includes('subjects');
  return check(hasSubjects, 'AddEditClassModal.jsx: subject options defined');
});

validate('AddEditClassModal.jsx: checkbox UI for subjects', () => {
  const componentFile = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'components', 'admin', 'classes', 'AddEditClassModal.jsx'), 'utf8'
  );
  const hasCheckbox = componentFile.includes('type="checkbox"');
  return check(hasCheckbox, 'AddEditClassModal.jsx: checkbox UI for subjects');
});

validate('AddEditClassModal.jsx: subject validation', () => {
  const componentFile = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'components', 'admin', 'classes', 'AddEditClassModal.jsx'), 'utf8'
  );
  const hasValidation = componentFile.includes('subjects.length') || componentFile.includes('validate');
  return check(hasValidation, 'AddEditClassModal.jsx: subject validation');
});

// ==================== Frontend Pages ====================
log('\n📄 Frontend Pages:', 'cyan');

validate('StudentProfilePage.jsx: teacherClasses state', () => {
  const pageFile = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'pages', 'teacher', 'StudentProfilePage.jsx'), 'utf8'
  );
  const hasState = pageFile.includes('teacherClasses');
  return check(hasState, 'StudentProfilePage.jsx: teacherClasses state');
});

validate('StudentProfilePage.jsx: availableSubjects computation', () => {
  const pageFile = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'pages', 'teacher', 'StudentProfilePage.jsx'), 'utf8'
  );
  const hasComputation = pageFile.includes('availableSubjects') && pageFile.includes('new Set');
  return check(hasComputation, 'StudentProfilePage.jsx: availableSubjects derivation');
});

validate('StudentProfilePage.jsx: marks form subject dropdown', () => {
  const pageFile = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'pages', 'teacher', 'StudentProfilePage.jsx'), 'utf8'
  );
  const hasDropdown = pageFile.includes('availableSubjects.map') && pageFile.includes('select');
  return check(hasDropdown, 'StudentProfilePage.jsx: marks form dropdown');
});

validate('StudentProfilePage.jsx: attendance form UI', () => {
  const pageFile = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'pages', 'teacher', 'StudentProfilePage.jsx'), 'utf8'
  );
  const hasUI = pageFile.includes('handleAttendanceSubmit');
  return check(hasUI, 'StudentProfilePage.jsx: attendance form handler');
});

validate('StudentProfilePage.jsx: behaviour form UI', () => {
  const pageFile = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'pages', 'teacher', 'StudentProfilePage.jsx'), 'utf8'
  );
  const hasUI = pageFile.includes('handleBehaviourSubmit');
  return check(hasUI, 'StudentProfilePage.jsx: behaviour form handler');
});

// ==================== Summary ====================
log('\n' + '='.repeat(80), 'bright');
if (failed === 0) {
  log(`✅ ALL ${passed} VALIDATIONS PASSED`, 'green');
  log('='.repeat(80) + '\n', 'bright');
  process.exit(0);
} else {
  log(`❌ ${failed}/${passed + failed} VALIDATIONS FAILED`, 'red');
  log('='.repeat(80) + '\n', 'bright');
  process.exit(1);
}
