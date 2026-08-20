// ============================================================
// JT SHIPPER - APP.JS
// HTML + JAVASCRIPT + SUPABASE
// ============================================================


// ============================================================
// 1. SUPABASE CONFIG
// ============================================================

const SUPABASE_URL =
  "https://fwamplkwgsxotcykqxhd.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_l7M95el4HZhbXCj4rzq9pg_-1MoyZoQ";


// Kiểm tra thư viện Supabase

if (!window.supabase) {

  console.error(
    "Không tìm thấy thư viện Supabase."
  );

  alert(
    "❌ Không tải được Supabase.\n" +
    "Hãy kiểm tra kết nối Internet."
  );

  throw new Error(
    "Supabase library chưa được tải."
  );
}


// Khởi tạo Supabase

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


console.log(
  "✅ JT Shipper: Supabase đã khởi tạo"
);


// ============================================================
// 2. LẤY CÁC ELEMENT HTML
// ============================================================

const searchInput =
  document.getElementById(
    "searchInput"
  );

const searchButton =
  document.getElementById(
    "searchButton"
  );

const clearSearch =
  document.getElementById(
    "clearSearch"
  );

const results =
  document.getElementById(
    "results"
  );

const resultCount =
  document.getElementById(
    "resultCount"
  );

const customerForm =
  document.getElementById(
    "customerForm"
  );

const saveButton =
  document.getElementById(
    "saveButton"
  );


// ============================================================
// 3. KIỂM TRA ELEMENT
// ============================================================

if (!searchInput) {
  console.error(
    "Không tìm thấy #searchInput"
  );
}

if (!searchButton) {
  console.error(
    "Không tìm thấy #searchButton"
  );
}

if (!results) {
  console.error(
    "Không tìm thấy #results"
  );
}

if (!customerForm) {
  console.error(
    "Không tìm thấy #customerForm"
  );
}


// ============================================================
// 4. CHUẨN HÓA SỐ ĐIỆN THOẠI
// ============================================================

function cleanPhone(phone) {

  return String(phone || "")
    .replace(/\D/g, "");
}


// ============================================================
// 5. ESCAPE HTML
// ============================================================

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// ============================================================
// 6. HIỂN THỊ THÔNG BÁO TRỐNG
// ============================================================

function showEmpty(message) {

  if (!results) {
    return;
  }

  results.innerHTML = `

    <div class="empty-state">

      <div class="empty-icon">
        🔍
      </div>

      <h3>
        ${message}
      </h3>

      <p>
        Hãy thử nhập số điện thoại khác.
      </p>

    </div>

  `;


  if (resultCount) {

    resultCount.textContent =
      "0 kết quả";

  }
}


// ============================================================
// 7. LOADING
// ============================================================

function showLoading() {

  results.innerHTML = `

    <div class="empty-state">

      <div class="empty-icon">
        ⏳
      </div>

      <h3>
        Đang tìm kiếm...
      </h3>

      <p>
        Vui lòng chờ một chút.
      </p>

    </div>

  `;

}


// ============================================================
// 8. TÌM KIẾM KHÁCH HÀNG
// ============================================================

async function searchCustomers() {

  let keyword =
    searchInput.value.trim();


  // Chỉ lấy số

  keyword =
    cleanPhone(keyword);


  // Không nhập gì

  if (!keyword) {

    showEmpty(
      "Chưa nhập số điện thoại"
    );

    return;
  }


  // Tối thiểu 2 số

  if (keyword.length < 2) {

    showEmpty(
      "Vui lòng nhập ít nhất 2 số"
    );

    return;
  }


  // Disable nút

  searchButton.disabled =
    true;

  searchButton.innerHTML =
    "⏳ ĐANG TÌM";


  showLoading();


  try {

    let query =
      supabaseClient
        .from("customers")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    // ======================================================
    // FULL SỐ ĐIỆN THOẠI
    // ======================================================

    if (keyword.length >= 5) {

      query =
        query.eq(
          "phone",
          keyword
        );

    }


    // ======================================================
    // 2 - 4 SỐ CUỐI
    // ======================================================

    else {

      query =
        query.ilike(
          "phone",
          `%${keyword}`
        );

    }


    const {
      data,
      error
    } = await query;


    if (error) {

      console.error(
        "Supabase search error:",
        error
      );

      throw error;
    }


    console.log(
      "Kết quả:",
      data
    );


    renderResults(
      data || []
    );

  }

  catch (error) {

    console.error(
      "Lỗi tìm kiếm:",
      error
    );


    showError(
      error
    );

  }

  finally {

    searchButton.disabled =
      false;

    searchButton.innerHTML =
      "🔎 TRA CỨU";

  }

}


// ============================================================
// 9. HIỂN THỊ KẾT QUẢ
// ============================================================

function renderResults(data) {

  if (!resultCount) {
    return;
  }


  resultCount.textContent =
    `${data.length} kết quả`;


  if (!data.length) {

    results.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          😕
        </div>

        <h3>
          Không tìm thấy khách hàng
        </h3>

        <p>
          Không có dữ liệu phù hợp với số điện thoại này.
        </p>

      </div>

    `;

    return;
  }


  results.innerHTML =
    data
      .map(
        customer =>
          createCustomerHTML(
            customer
          )
      )
      .join("");

}


// ============================================================
// 10. TẠO CARD KHÁCH HÀNG
// ============================================================

function createCustomerHTML(
  customer
) {

  const addressParts = [

    customer.address,

    customer.hamlet
      ? `Ấp ${customer.hamlet}`
      : "",

    customer.commune
      ? customer.commune
      : ""

  ].filter(Boolean);


  const address =
    addressParts.join(", ");


  return `

    <div
      class="customer"
      data-id="${escapeHTML(customer.id)}"
    >


      <!-- TOP -->

      <div class="customer-top">


        <div>

          <div class="customer-name">

            ${
              escapeHTML(
                customer.customer_name ||
                "Chưa có tên"
              )
            }

          </div>


          <div class="customer-phone">

            📞
            ${escapeHTML(
              customer.phone
            )}

          </div>

        </div>


        <!-- BUTTON -->

        <div class="action-buttons">

          <button
            class="edit-button"
            type="button"
            onclick="editCustomer('${customer.id}')"
          >
            ✏️ Sửa
          </button>


          <button
            class="delete-button"
            type="button"
            onclick="deleteCustomer('${customer.id}')"
          >
            🗑️ Xóa
          </button>

        </div>


      </div>


      <!-- THÔNG TIN -->

      <div class="info-grid">


        <div class="info-item">

          🚚

          <b>Shipper</b>

          <br>

          ${
            escapeHTML(
              customer.shipper_name ||
              "Chưa có"
            )
          }

        </div>


        <div class="info-item">

          🔧

          <b>Người chạy/lắp</b>

          <br>

          ${
            escapeHTML(
              customer.installer_name ||
              "Chưa có"
            )
          }

        </div>


      </div>


      <!-- ADDRESS -->

      ${
        address

        ?

        `

          <div class="address">

            📍

            <b>Địa chỉ:</b>

            <br>

            ${escapeHTML(address)}

          </div>

        `

        :

        ""

      }


      <!-- NOTE -->

      ${
        customer.note

        ?

        `

          <div class="note">

            📝

            <b>Ghi chú:</b>

            <br>

            ${escapeHTML(
              customer.note
            )}

          </div>

        `

        :

        ""

      }


    </div>

  `;

}


// ============================================================
// 11. LẤY GIÁ TRỊ FORM
// ============================================================

function getFormData() {

  return {

    phone:

      cleanPhone(
        document
          .getElementById(
            "phone"
          )
          .value
      ),


    customer_name:

      document
        .getElementById(
          "customer_name"
        )
        .value
        .trim(),


    shipper_name:

      document
        .getElementById(
          "shipper_name"
        )
        .value
        .trim(),


    installer_name:

      document
        .getElementById(
          "installer_name"
        )
        .value
        .trim(),


    hamlet:

      document
        .getElementById(
          "hamlet"
        )
        .value
        .trim(),


    commune:

      document
        .getElementById(
          "commune"
        )
        .value
        .trim(),


    address:

      document
        .getElementById(
          "address"
        )
        .value
        .trim(),


    note:

      document
        .getElementById(
          "note"
        )
        .value
        .trim()

  };

}


// ============================================================
// 12. RESET FORM
// ============================================================

function resetForm() {

  customerForm.reset();


  delete customerForm.dataset.editId;


  saveButton.innerHTML =
    "💾 LƯU KHÁCH HÀNG";

}


// ============================================================
// 13. THÊM / CẬP NHẬT
// ============================================================

customerForm.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();


    const formData =
      getFormData();


    // Kiểm tra SĐT

    if (!formData.phone) {

      alert(
        "⚠️ Vui lòng nhập số điện thoại."
      );

      return;
    }


    if (
      formData.phone.length < 8
    ) {

      alert(
        "⚠️ Số điện thoại không hợp lệ."
      );

      return;
    }


    const editId =
      customerForm.dataset.editId;


    // ========================================================
    // UPDATE
    // ========================================================

    if (editId) {

      await updateCustomer(
        editId,
        formData
      );

      return;
    }


    // ========================================================
    // INSERT
    // ========================================================

    await addCustomer(
      formData
    );

  }
);


// ============================================================
// 14. THÊM KHÁCH HÀNG
// ============================================================

async function addCustomer(
  customer
) {

  saveButton.disabled =
    true;

  saveButton.innerHTML =
    "⏳ ĐANG LƯU...";


  try {

    // Kiểm tra SĐT đã có

    const {
      data: existing,
      error: checkError
    } =
      await supabaseClient
        .from("customers")
        .select("id")
        .eq(
          "phone",
          customer.phone
        )
        .limit(1);


    if (checkError) {

      throw checkError;
    }


    if (
      existing &&
      existing.length > 0
    ) {

      alert(
        "⚠️ Số điện thoại này đã tồn tại!"
      );

      return;
    }


    // INSERT

    const {
      data,
      error
    } =
      await supabaseClient
        .from("customers")
        .insert([
          customer
        ])
        .select();


    if (error) {

      throw error;
    }


    console.log(
      "Đã thêm:",
      data
    );


    alert(
      "✅ Đã thêm khách hàng thành công!"
    );


    // Reset

    resetForm();


    // Tìm lại

    searchInput.value =
      customer.phone;


    await searchCustomers();

  }

  catch (error) {

    console.error(
      "Insert error:",
      error
    );


    showDatabaseError(
      error
    );

  }

  finally {

    saveButton.disabled =
      false;

    saveButton.innerHTML =
      "💾 LƯU KHÁCH HÀNG";

  }

}


// ============================================================
// 15. SỬA KHÁCH HÀNG
// ============================================================

async function editCustomer(
  id
) {

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("customers")
        .select("*")
        .eq(
          "id",
          id
        )
        .single();


    if (error) {

      throw error;
    }


    // Đưa dữ liệu vào form

    document.getElementById(
      "phone"
    ).value =
      data.phone || "";


    document.getElementById(
      "customer_name"
    ).value =
      data.customer_name || "";


    document.getElementById(
      "shipper_name"
    ).value =
      data.shipper_name || "";


    document.getElementById(
      "installer_name"
    ).value =
      data.installer_name || "";


    document.getElementById(
      "hamlet"
    ).value =
      data.hamlet || "";


    document.getElementById(
      "commune"
    ).value =
      data.commune || "";


    document.getElementById(
      "address"
    ).value =
      data.address || "";


    document.getElementById(
      "note"
    ).value =
      data.note || "";


    // Lưu ID đang sửa

    customerForm.dataset.editId =
      id;


    // Đổi nút

    saveButton.innerHTML =
      "🔄 CẬP NHẬT KHÁCH HÀNG";


    // Cuộn xuống form

    customerForm.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });


  }

  catch (error) {

    console.error(
      "Edit error:",
      error
    );


    showDatabaseError(
      error
    );

  }

}


// ============================================================
// 16. UPDATE KHÁCH HÀNG
// ============================================================

async function updateCustomer(
  id,
  customer
) {

  saveButton.disabled =
    true;

  saveButton.innerHTML =
    "⏳ ĐANG CẬP NHẬT...";


  try {

    // Kiểm tra số điện thoại
    // có bị trùng với người khác không

    const {
      data: duplicate,
      error: duplicateError
    } =
      await supabaseClient
        .from("customers")
        .select("id")
        .eq(
          "phone",
          customer.phone
        )
        .neq(
          "id",
          id
        )
        .limit(1);


    if (duplicateError) {

      throw duplicateError;
    }


    if (
      duplicate &&
      duplicate.length > 0
    ) {

      alert(
        "⚠️ Số điện thoại này đã thuộc khách hàng khác."
      );

      return;
    }


    // UPDATE

    const {
      error
    } =
      await supabaseClient
        .from("customers")
        .update({

          phone:
            customer.phone,

          customer_name:
            customer.customer_name,

          shipper_name:
            customer.shipper_name,

          installer_name:
            customer.installer_name,

          hamlet:
            customer.hamlet,

          commune:
            customer.commune,

          address:
            customer.address,

          note:
            customer.note,

          updated_at:
            new Date().toISOString()

        })
        .eq(
          "id",
          id
        );


    if (error) {

      throw error;
    }


    alert(
      "✅ Đã cập nhật khách hàng!"
    );


    // Reset

    resetForm();


    // Tìm lại

    searchInput.value =
      customer.phone;


    await searchCustomers();

  }

  catch (error) {

    console.error(
      "Update error:",
      error
    );


    showDatabaseError(
      error
    );

  }

  finally {

    saveButton.disabled =
      false;

    saveButton.innerHTML =
      "💾 LƯU KHÁCH HÀNG";

  }

}


// ============================================================
// 17. XÓA KHÁCH HÀNG
// ============================================================

async function deleteCustomer(
  id
) {

  const confirmed =
    confirm(
      "⚠️ Bạn có chắc muốn xóa khách hàng này?\n\n" +
      "Dữ liệu sẽ bị xóa khỏi database."
    );


  if (!confirmed) {

    return;
  }


  try {

    const {
      error
    } =
      await supabaseClient
        .from("customers")
        .delete()
        .eq(
          "id",
          id
        );


    if (error) {

      throw error;
    }


    alert(
      "✅ Đã xóa khách hàng."
    );


    await searchCustomers();

  }

  catch (error) {

    console.error(
      "Delete error:",
      error
    );


    showDatabaseError(
      error
    );

  }

}


// ============================================================
// 18. XÓA Ô TÌM KIẾM
// ============================================================

if (clearSearch) {

  clearSearch.addEventListener(
    "click",
    function() {

      searchInput.value = "";

      resultCount.textContent =
        "0 kết quả";


      results.innerHTML = `

        <div class="empty-state">

          <div class="empty-icon">
            🔍
          </div>

          <h3>
            Chưa có kết quả
          </h3>

          <p>
            Nhập số điện thoại phía trên
            để bắt đầu tra cứu.
          </p>

        </div>

      `;


      searchInput.focus();

    }
  );

}


// ============================================================
// 19. CLICK NÚT TÌM
// ============================================================

if (searchButton) {

  searchButton.addEventListener(
    "click",
    searchCustomers
  );

}


// ============================================================
// 20. ENTER ĐỂ TÌM
// ============================================================

if (searchInput) {

  searchInput.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key === "Enter"
      ) {

        event.preventDefault();

        searchCustomers();

      }

    }
  );

}


// ============================================================
// 21. CHỈ CHO NHẬP SỐ ĐIỆN THOẠI
// ============================================================

const phoneInput =
  document.getElementById(
    "phone"
  );


if (phoneInput) {

  phoneInput.addEventListener(
    "input",
    function() {

      this.value =
        cleanPhone(
          this.value
        );

    }
  );

}


if (searchInput) {

  searchInput.addEventListener(
    "input",
    function() {

      this.value =
        cleanPhone(
          this.value
        );

    }
  );

}


// ============================================================
// 22. HIỂN THỊ LỖI DATABASE
// ============================================================

function showDatabaseError(
  error
) {

  let message =
    error?.message ||
    "Lỗi không xác định";


  // RLS

  if (
    message
      .toLowerCase()
      .includes(
        "row-level security"
      )
  ) {

    message =
      "Database đang chặn quyền truy cập (RLS).\n\n" +
      "Bạn cần tạo Policy trong Supabase.";
  }


  // Permission

  else if (
    message
      .toLowerCase()
      .includes(
        "permission"
      )
  ) {

    message =
      "Database không cho phép thao tác này.\n\n" +
      "Kiểm tra RLS/Policy trong Supabase.";
  }


  alert(
    "❌ LỖI DATABASE\n\n" +
    message
  );

}


// ============================================================
// 23. HIỂN THỊ LỖI TÌM KIẾM
// ============================================================

function showError(
  error
) {

  const message =
    error?.message ||
    "Không thể kết nối database.";


  results.innerHTML = `

    <div class="empty-state">

      <div class="empty-icon">
        ⚠️
      </div>

      <h3>
        Có lỗi xảy ra
      </h3>

      <p>
        ${escapeHTML(message)}
      </p>

    </div>

  `;


  resultCount.textContent =
    "Lỗi";

}


// ============================================================
// 24. TEST DATABASE
// ============================================================

async function testDatabase() {

  try {

    const {
      error
    } =
      await supabaseClient
        .from("customers")
        .select("id")
        .limit(1);


    if (error) {

      console.error(
        "❌ Database test:",
        error
      );

      return false;
    }


    console.log(
      "✅ JT Shipper: Database hoạt động!"
    );


    return true;

  }

  catch (error) {

    console.error(
      "❌ Database connection:",
      error
    );

    return false;

  }

}


// ============================================================
// 25. CHẠY TEST KHI TRANG MỞ
// ============================================================

testDatabase();


// ============================================================
// END
// ============================================================

console.log(
  "🚚 JT SHIPPER APP READY"
);
