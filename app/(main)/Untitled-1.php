<?php
include('../../action.php');
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);



$type = $data['type'] ?? ($_REQUEST['type'] ?? '');
 
// print_r($_REQUEST);
// die;

// if ($type === 'update_verification') {

//     echo "hi";
//     die;
// } else {
//     echo "by";
//     die;
// }

switch ($type) {
    case 'state':
        if ($method === 'GET') {
            $state_date = array();
            $sql = $obj->executequery("select * from states order by state_name");
            foreach ($sql as $key) {
                $state_date[] = $key;
            }
            // $states = $obj->select_record("states", array(1 => 1));
            echo json_encode([
                "status" => "success",
                "data" => $state_date
            ]);
        } else {
            http_response_code(405);
            echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        }
        break;
    case 'update_verification':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            print_r($_REQUEST);
            die;
            if (isset($_POST['reg_id']) && !empty($_POST['reg_id'])) {
                $reg_id = $obj->test_input($_POST['reg_id']);
                $res = $obj->update_record("registration", ["reg_id" => $reg_id], ["is_verified" => 1]);
                echo json_encode([
                    "status" => "success",
                    "message" => "OTP verified successfully. Redirecting to login page."
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Missing or invalid registration ID."
                ]);
            }
        } else {
            http_response_code(405);
            echo json_encode([
                "status" => "error",
                "message" => "Method not allowed"
            ]);
        }
        break;
    case 'registration':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(["status" => "error", "message" => "Method not allowed"]);
            exit;
        }
        $createdate = date('Y-m-d');
        $ipaddress = $_SERVER['REMOTE_ADDR'];
        $first_name = $obj->test_input($data['first_name'] ?? '');
        $last_name = $obj->test_input($data['last_name'] ?? '');
        $email = $obj->test_input($data['email'] ?? '');
        $contact_no = $obj->test_input($data['contact_no'] ?? '');
        $state_id = intval($data['state_id'] ?? 0);
        $role = $obj->test_input($data['role'] ?? '');
        $is_approved = intval($data['is_approved'] ?? 0);
        $is_verified = intval($data['is_verified'] ?? 0);
        $referral_code = intval($data['referral_code'] ?? 0);
        $reg_date = $obj->test_input($data['reg_date'] ?? $createdate);
        $password_raw = $data['password'] ?? '';
        if ($first_name === '' || $email === '' || $password_raw === '') {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Required fields missing"]);
            exit;
        }
        $check = $obj->select_record("registration", ["email" => $email]);
        if (!empty($check)) {
            http_response_code(409);
            echo json_encode(["status" => "error", "message" => "Email already registered"]);
            exit;
        }
        $count = $obj->getvalfield("registration", "count(*)", "contact_no='$contact_no' and role='$role'");
        if ($count > 0) {
            echo json_encode(["status" => "error", "message" => "This contact number already exists"]);
            exit;
        }

        $hashed_password = password_hash($password_raw, PASSWORD_BCRYPT);
        $otp = rand(100000, 999999);

        $form_data = [
            "first_name" => $first_name,
            "last_name" => $last_name,
            "email" => $email,
            "contact_no" => $contact_no,
            "state_id" => $state_id,
            "role" => $role,
            "is_approved" => $is_approved,
            "is_verified" => $is_verified,
            "referral_code" => $referral_code,
            "reg_date" => $reg_date,
            "password" => $hashed_password,
            "create_date" => $createdate,
            "ipaddres" => $ipaddress
        ];
        $last_id = $obj->insert_record_lastid("registration", $form_data);
        if ($last_id) {
            echo json_encode([
                "status" => "success",
                "message" => "Registration successful",
                "otp" => $otp,
                "data" => [
                    "first_name" => $first_name,
                    "reg_id" => $last_id,
                    "last_name" => $last_name,
                    "email" => $email,
                    "contact_no" => $contact_no,
                    "state_id" => $state_id,
                    "role" => $role,
                    "referral_code" => $referral_code,
                    "reg_date" => $reg_date
                ]
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to insert record"]);
        }
        break;
    default:
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid request type"]);
        break;
}


