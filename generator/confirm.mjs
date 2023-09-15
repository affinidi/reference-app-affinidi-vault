import inquirer from 'inquirer'

const { confirmed } = await inquirer.prompt([
  {
    default: true,
    name: 'confirmed',
    message: 'This will overwrite any changes made to the use-cases/ directory. Are you sure?',
    type: 'confirm',
  }
])

if (confirmed) {
  process.exit(0)
} else {
  process.exit(1)
}
