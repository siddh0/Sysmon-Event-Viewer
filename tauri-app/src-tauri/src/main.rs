use xml2json_rs::{JsonConfig};
use std::fs::{self, File};
use std::io::{Read, Write};
use tauri::{command, generate_handler, Builder};
use std::path::PathBuf;
use serde_json; // For pretty-printing

#[command]
fn upload_file_and_convert(file_content: String) -> Result<String, String> {
    // Specify the directory to save the files
    let save_dir = PathBuf::from("../src/uploads");
    
    // Create the directory if it doesn't exist
    if !save_dir.exists() {
        fs::create_dir_all(&save_dir).map_err(|e| e.to_string())?;
    }

    // Define file paths for the XML and JSON files
    let file_path = save_dir.join("uploaded_file.xml");
    let json_file_path = save_dir.join("converted_file.json");

    // Write the XML content to a permanent file
    let mut file = File::create(&file_path).map_err(|e| e.to_string())?;
    file.write_all(file_content.as_bytes()).map_err(|e| e.to_string())?;

    // Read the file back
    let mut file = File::open(&file_path).map_err(|e| e.to_string())?;
    let mut xml_data = String::new();
    file.read_to_string(&mut xml_data).map_err(|e| e.to_string())?;

    // Configure JsonConfig
    let json_config = JsonConfig::new()
        .ignore_attrs(false)  // Adjust to handle attributes if necessary
        .explicit_array(true) // Explicit arrays for repeated elements
        .finalize();

    // Build JSON using the customized configuration
    let json_string = json_config.build_string_from_xml(&xml_data)
        .map_err(|e| format!("Error converting XML to JSON: {}", e))?;

    // Parse the JSON string into a serde_json::Value for pretty-printing
    let json_value: serde_json::Value = serde_json::from_str(&json_string)
        .map_err(|e| format!("Error parsing JSON: {}", e))?;

    // Convert to pretty-printed JSON
    let pretty_json = serde_json::to_string_pretty(&json_value)
        .map_err(|e| format!("Error formatting JSON: {}", e))?;

    // Write the pretty-printed JSON content to a permanent file
    let mut json_file = File::create(&json_file_path).map_err(|e| e.to_string())?;
    json_file.write_all(pretty_json.as_bytes()).map_err(|e| e.to_string())?;

    // Return the pretty-printed JSON content
    Ok(pretty_json)
}

fn main() {
    Builder::default()
        .invoke_handler(generate_handler![upload_file_and_convert])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
