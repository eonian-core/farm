const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const YAML = require('yaml');

if (process.argv.length < 4) {
  console.log('Usage: node generateFiles.js <path_to_input_folder> <path_to_output_folder>');
  process.exit(1);
}

// Get the input and output folder paths from command-line arguments
const inputFolderPath = process.argv[2];
const outputFolderPath = process.argv[3];

// Ensure the output directory exists, if not create it
if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath, { recursive: true });
}

// Load and compile the template
const templatePath = path.join(inputFolderPath, 'template.yaml');
const template = fs.readFileSync(templatePath, 'utf8');
const templateScript = Handlebars.compile(template);

// Load the config file
const configPath = path.join(inputFolderPath, 'config.yaml');
const configContent = fs.readFileSync(configPath, 'utf8');
const config = YAML.parse(configContent);

// Loop through each item in the config file and generate the YAML files
config.files.forEach(item => {
  // Render the template with data
  const renderedTemplate = templateScript(item.data);

  // We need to wrap the output in single quotes to ensure
  // it is treated as a string in the YAML file.
  const modifiedTemplate = renderedTemplate.split('\n').map(line => {
    if (line.includes('0x')) {
      return `${line.substring(0, line.indexOf(':') + 1)} '${line.substring(line.indexOf(':') + 1).trim()}'`;
    }
    return line;
  }).join('\n');

  // Parse the rendered template to an object
  const object = YAML.parse(modifiedTemplate);

  // Stringify and write the object to a YAML file
  const yamlContent = YAML.stringify(object);
  const outputPath = path.join(outputFolderPath, item.output);
  fs.writeFileSync(outputPath, yamlContent);

  console.log(`File generated: ${outputPath}`);
});
