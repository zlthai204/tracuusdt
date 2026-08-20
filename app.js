/* =========================================================
   JT SHIPPER - APP.JS
   Supabase + Search + Add + Edit + Delete
========================================================= */


/* =========================================================
   1. SUPABASE CONFIG
========================================================= */

const SUPABASE_URL =
  "https://fwamplkwgsxotcykqxhd.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_l7M95el4HZhbXCj4rzq9pg_-1MoyZoQ";


/* =========================================================
   2. SUPABASE CLIENT
========================================================= */

let supabaseClient = null;


/*
 * Khởi tạo Supabase
 */
function initSupabase() {

  if (
    !SUPABASE_URL ||
    !SUPABASE_ANON_KEY
  ) {

    console.error(
      "Thiếu SUPABASE_URL hoặc SUPABASE_ANON_KEY"
    );

    return false;
  }


  if (
    !SUPABASE_URL.startsWith("http://") &&
    !SUPABASE_URL.startsWith("https://")
  ) {

    console.error(
      "SUPABASE_URL phải bắt đầu bằng http:// hoặc https://"
    );

    return false;
  }


  if (
    typeof window.supabase === "undefined"
  ) {

    console.error(
      "Chưa tải được thư viện Supabase."
    );

    return false;
  }


  try {

    supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
      );

    console.log(
      "Supabase initialized."
    );

    return true;

  } catch (error) {

    console.error(
      "Không thể khởi tạo Supabase:",
      error
    );

    return false;
  }

}


/* =========================================================
   3. DOM
========================================================= */

let searchInput;
let searchButton;
let clearSearch;
let results;
let resultCount;

let customerForm;
let saveButton;


/*
 * Lấy DOM sau khi HTML đã load
 */
function initDOM() {

  searchInput =
    document.getElementById(
      "searchInput"
    );

  searchButton =
    document.getElementById(
      "searchButton"
    );

  clearSearch =
    document.getElementById(
      "clearSearch"
    );

  results =
    document.getElementById(
      "results"
    );

  resultCount =
    document.getElementById(
      "resultCount"
    );

  customerForm =
    document.getElementById(
      "customerForm"
    );

  saveButton =
    document.getElementById(
      "saveButton"
    );


  console.log(
    "DOM initialized."
  );

}


/* =========================================================
   4. SAFE HTML
========================================================= */

/*
 * Chống HTML injection khi đưa dữ liệu
 * Supabase vào giao diện.
 */

function escapeHTML(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   5. FORMAT
========================================================= */

function normalizePhone(value) {

  return String(value || "")
    .replace(/\D/g, "")
    .trim();

}


function formatDate(date) {

  if (!date) {

    return "";

  }


  try {

    return new Date(date)
      .toLocaleString(
        "vi-VN",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }
      );

  } catch {

    return "";

  }

}


/* =========================================================
   6. MESSAGE
========================================================= */

function showMessage(
  message,
  type = "info"
) {

  if (type === "error") {

    alert(
      "❌ " + message
    );

  } else if (type === "success") {

    alert(
      "✅ " + message
    );

  } else {

    alert(message);

  }

}


/* =========================================================
   7. LOADING
========================================================= */

function setSearchLoading(
  loading
) {

  if (!searchButton) {

    return;

  }


  searchButton.disabled =
    loading;


  if (loading) {

    searchButton.innerHTML =
      "⏳ ĐANG TÌM...";

  } else {

    searchButton.innerHTML =
      "🔎 TRA CỨU";

  }

}


function setSaveLoading(
  loading
) {

  if (!saveButton) {

    return;

  }


  saveButton.disabled =
    loading;


  if (loading) {

    saveButton.innerHTML =
      "⏳ ĐANG LƯU...";

  } else {

    saveButton.innerHTML =
      "💾 LƯU THÔNG TIN";

  }

}


/* =========================================================
   8. GET FORM DATA
========================================================= */

function getFormValue(id) {

  const element =
    document.getElementById(id);


  if (!element) {

    console.warn(
      "Không tìm thấy element:",
      id
    );

    return "";

  }


  return element.value.trim();

}


/*
 * Lấy toàn bộ dữ liệu từ form
 */

function getFormData() {

  const phone =
    normalizePhone(
      getFormValue("phone")
    );


  const data = {

    phone: phone,

    customer_name:
      getFormValue(
        "customer_name"
      ),

    shipper_name:
      getFormValue(
        "shipper_name"
      ),

    installer_name:
      getFormValue(
        "installer_name"
      ),

    hamlet:
      getFormValue(
        "hamlet"
      ),

    commune:
      getFormValue(
        "commune"
      ),

    address:
      getFormValue(
        "address"
      ),

    note:
      getFormValue(
        "note"
      )

  };


  return data;

}


/* =========================================================
   9. VALIDATE PHONE
========================================================= */

function validatePhone(phone) {

  if (!phone) {

    return {
      valid: false,
      message:
        "Vui lòng nhập số điện thoại."
    };

  }


  if (
    phone.length < 2
  ) {

    return {
      valid: false,
      message:
        "Số điện thoại phải có ít nhất 2 số."
    };

  }


  if (
    phone.length > 15
  ) {

    return {
      valid: false,
      message:
        "Số điện thoại không hợp lệ."
    };

  }


  return {
    valid: true,
    message: ""
  };

}


/* =========================================================
   10. SEARCH CUSTOMER
========================================================= */

async function searchCustomers() {

  if (!supabaseClient) {

    showMessage(
      "Supabase chưa được khởi tạo.",
      "error"
    );

    return;

  }


  const keyword =
    normalizePhone(
      searchInput
        ? searchInput.value
        : ""
    );


  if (!keyword) {

    showMessage(
      "Vui lòng nhập số điện thoại cần tra cứu.",
      "error"
    );

    return;

  }


  if (keyword.length < 2) {

    showMessage(
      "Bạn cần nhập ít nhất 2 số cuối.",
      "error"
    );

    return;

  }


  setSearchLoading(true);


  renderLoading();


  try {

    /*
     * Tìm theo:
     *
     * 0912345678
     *
     * hoặc:
     *
     * 78
     * 678
     * 5678
     *
     * vì dùng ilike %keyword
     */

    const {
      data,
      error
    } = await supabaseClient

      .from("customers")

      .select("*")

      .ilike(
        "phone",
        `%${keyword}%`
      )

      .order(
        "created_at",
        {
          ascending: false
        }
      );


    if (error) {

      console.error(
        "Search error:",
        error
      );

      renderError(
        getSupabaseError(error)
      );

      return;

    }


    renderResults(
      data || []
    );


  } catch (error) {

    console.error(
      "Search exception:",
      error
    );

    renderError(
      error.message ||
      "Có lỗi xảy ra khi tra cứu."
    );


  } finally {

    setSearchLoading(false);

  }

}


/* =========================================================
   11. RENDER LOADING
========================================================= */

function renderLoading() {

  if (!results) {

    return;

  }


  results.innerHTML = `

    <div class="empty">

      <div
        class="empty-icon"
      >
        ⏳
      </div>

      <strong>
        Đang tra cứu...
      </strong>

      <p>
        Vui lòng chờ một chút.
      </p>

    </div>

  `;


  if (resultCount) {

    resultCount.textContent =
      "Đang tìm...";

  }

}


/* =========================================================
   12. RENDER ERROR
========================================================= */

function renderError(
  message
) {

  if (!results) {

    return;

  }


  results.innerHTML = `

    <div class="empty">

      <div
        class="empty-icon"
        style="
          background:#fff1f2;
        "
      >
        ❌
      </div>

      <strong>
        Không thể tra cứu
      </strong>

      <p>
        ${escapeHTML(message)}
      </p>

    </div>

  `;


  if (resultCount) {

    resultCount.textContent =
      "Lỗi";

  }

}


/* =========================================================
   13. RENDER RESULTS
========================================================= */

function renderResults(
  customers
) {

  if (!results) {

    return;

  }


  if (!Array.isArray(customers)) {

    customers = [];

  }


  if (resultCount) {

    resultCount.textContent =
      `${customers.length} kết quả`;

  }


  if (
    customers.length === 0
  ) {

    results.innerHTML = `

      <div class="empty">

        <div
          class="empty-icon"
        >
          🔎
        </div>

        <strong>
          Không tìm thấy khách hàng
        </strong>

        <p>
          Chưa có thông tin với số điện thoại này.
        </p>

      </div>

    `;

    return;

  }


  results.innerHTML =
    customers
      .map(createCustomerCard)
      .join("");

}


/* =========================================================
   14. CUSTOMER CARD
========================================================= */

function createCustomerCard(
  customer
) {

  const addressParts = [];


  if (
    customer.address
  ) {

    addressParts.push(
      customer.address
    );

  }


  if (
    customer.hamlet
  ) {

    addressParts.push(
      `Ấp ${customer.hamlet}`
    );

  }


  if (
    customer.commune
  ) {

    addressParts.push(
      `Xã ${customer.commune}`
    );

  }


  const address =
    addressParts
      .filter(Boolean)
      .join(", ");


  return `

    <article
      class="customer-card"
    >


      <!-- =====================================
           HEADER
      ====================================== -->

      <div
        style="
          padding:20px;
          border-bottom:
            1px solid #f0f0f0;
        "
      >

        <div
          style="
            display:flex;
            justify-content:
              space-between;
            align-items:
              flex-start;
            gap:15px;
          "
        >

          <div>

            <div
              style="
                font-size:18px;
                font-weight:900;
                color:#18181b;
              "
            >

              👤

              ${
                escapeHTML(
                  customer.customer_name ||
                  "Chưa có tên khách hàng"
                )
              }

            </div>


            <div
              style="
                margin-top:7px;
                color:#e30613;
                font-size:16px;
                font-weight:900;
              "
            >

              📱

              ${
                escapeHTML(
                  customer.phone || ""
                )
              }

            </div>

          </div>


          <div
            style="
              display:flex;
              gap:6px;
              flex-wrap:wrap;
              justify-content:flex-end;
            "
          >

            <button
              type="button"
              onclick="
                editCustomer('${escapeHTML(
                  customer.id
                )}')
              "
              style="
                border:0;
                background:#f4f4f5;
                color:#27272a;
                padding:8px 10px;
                border-radius:7px;
                cursor:pointer;
                font-size:11px;
                font-weight:800;
              "
            >
              ✏️ Sửa
            </button>


            <button
              type="button"
              onclick="
                deleteCustomer('${escapeHTML(
                  customer.id
                )}')
              "
              style="
                border:0;
                background:#fff1f2;
                color:#e30613;
                padding:8px 10px;
                border-radius:7px;
                cursor:pointer;
                font-size:11px;
                font-weight:800;
              "
            >
              🗑 Xóa
            </button>

          </div>

        </div>

      </div>


      <!-- =====================================
           MAIN INFO
      ====================================== -->

      <div
        style="
          padding:18px;
          display:grid;
          grid-template-columns:
            repeat(2,minmax(0,1fr));
          gap:12px;
        "
      >


        <!-- NGƯỜI CHẠY / LẮP -->

        <div
          style="
            background:
              linear-gradient(
                135deg,
                #fff1f2,
                #ffffff
              );
            border:
              1px solid #fecdd3;
            border-left:
              5px solid #e30613;
            border-radius:12px;
            padding:16px;
            min-height:105px;
          "
        >

          <div
            style="
              color:#e30613;
              font-size:10px;
              font-weight:900;
              letter-spacing:1px;
              margin-bottom:8px;
            "
          >
            🔧 NGƯỜI CHẠY / LẮP
          </div>


          <div
            style="
              font-size:19px;
              font-weight:900;
              color:#18181b;
              line-height:1.3;
            "
          >

            ${
              escapeHTML(
                customer.installer_name ||
                "Chưa cập nhật"
              )
            }

          </div>


          <div
            style="
              margin-top:5px;
              font-size:10px;
              color:#71717a;
            "
          >
            Thông tin ưu tiên
          </div>

        </div>


        <!-- SHIPPER -->

        <div
          style="
            background:#fafafa;
            border:
              1px solid #e4e4e7;
            border-radius:12px;
            padding:16px;
            min-height:105px;
          "
        >

          <div
            style="
              color:#71717a;
              font-size:10px;
              font-weight:900;
              letter-spacing:1px;
              margin-bottom:8px;
            "
          >
            🚚 SHIPPER CHẠY
          </div>


          <div
            style="
              font-size:16px;
              font-weight:800;
              color:#27272a;
              line-height:1.3;
            "
          >

            ${
              escapeHTML(
                customer.shipper_name ||
                "Chưa cập nhật"
              )
            }

          </div>

        </div>


      </div>


      <!-- =====================================
           ADDRESS
      ====================================== -->

      ${
        address

          ? `

            <div
              style="
                margin:
                  0 18px 18px;
                padding:17px;
                background:
                  linear-gradient(
                    135deg,
                    #fff7ed,
                    #ffffff
                  );
                border:
                  1px solid #fed7aa;
                border-left:
                  5px solid #f97316;
                border-radius:12px;
              "
            >

              <div
                style="
                  color:#ea580c;
                  font-size:10px;
                  font-weight:900;
                  letter-spacing:1px;
                  margin-bottom:7px;
                "
              >

                📍 ĐỊA CHỈ GIAO HÀNG

              </div>


              <div
                style="
                  font-size:16px;
                  font-weight:800;
                  color:#18181b;
                  line-height:1.55;
                "
              >

                ${
                  escapeHTML(address)
                }

              </div>

            </div>

          `

          : `

            <div
              style="
                margin:
                  0 18px 18px;
                padding:14px;
                background:#fafafa;
                border:
                  1px dashed #d4d4d8;
                border-radius:10px;
                color:#a1a1aa;
                font-size:11px;
              "
            >

              📍 Chưa cập nhật địa chỉ

            </div>

          `
      }


      <!-- =====================================
           NOTE
      ====================================== -->

      ${
        customer.note

          ? `

            <div
              style="
                margin:
                  0 18px 18px;
                padding:14px;
                background:#f4f4f5;
                border-radius:10px;
              "
            >

              <div
                style="
                  color:#71717a;
                  font-size:9px;
                  font-weight:900;
                  letter-spacing:1px;
                  margin-bottom:5px;
                "
              >

                📝 GHI CHÚ

              </div>


              <div
                style="
                  font-size:12px;
                  color:#3f3f46;
                  line-height:1.6;
                "
              >

                ${
                  escapeHTML(
                    customer.note
                  )
                }

              </div>

            </div>

          `

          : ""
      }


      <!-- =====================================
           CREATED
      ====================================== -->

      ${
        customer.created_at

          ? `

            <div
              style="
                padding:
                  0 18px 16px;
                color:#a1a1aa;
                font-size:9px;
              "
            >

              🕐 Cập nhật:
              ${
                escapeHTML(
                  formatDate(
                    customer.created_at
                  )
                )
              }

            </div>

          `

          : ""
      }


    </article>

  `;

}


/* =========================================================
   15. ADD CUSTOMER
========================================================= */

async function addCustomer(
  event
) {

  if (event) {

    event.preventDefault();

  }


  if (!supabaseClient) {

    showMessage(
      "Supabase chưa được khởi tạo.",
      "error"
    );

    return;

  }


  const data =
    getFormData();


  const validation =
    validatePhone(
      data.phone
    );


  if (!validation.valid) {

    showMessage(
      validation.message,
      "error"
    );

    return;

  }


  setSaveLoading(true);


  try {

    /*
     * Kiểm tra số điện thoại
     * đã tồn tại hay chưa.
     */

    const {
      data: existing,
      error: checkError
    } = await supabaseClient

      .from("customers")

      .select("id")

      .eq(
        "phone",
        data.phone
      )

      .limit(1);


    if (checkError) {

      console.error(
        checkError
      );

      showMessage(
        getSupabaseError(
          checkError
        ),
        "error"
      );

      return;

    }


    if (
      existing &&
      existing.length > 0
    ) {

      const confirmUpdate =
        confirm(
          "Số điện thoại này đã tồn tại.\n\nBạn có muốn cập nhật thông tin không?"
        );


      if (!confirmUpdate) {

        return;

      }


      const id =
        existing[0].id;


      const {
        error: updateError
      } = await supabaseClient

        .from("customers")

        .update(data)

        .eq(
          "id",
          id
        );


      if (updateError) {

        console.error(
          updateError
        );

        showMessage(
          getSupabaseError(
            updateError
          ),
          "error"
        );

        return;

      }


      showMessage(
        "Đã cập nhật thông tin khách hàng.",
        "success"
      );


    } else {


      /*
       * Thêm khách hàng mới
       */

      const {
        error
      } = await supabaseClient

        .from("customers")

        .insert([
          data
        ]);


      if (error) {

        console.error(
          "Insert error:",
          error
        );

        showMessage(
          getSupabaseError(
            error
          ),
          "error"
        );

        return;

      }


      showMessage(
        "Đã lưu khách hàng thành công.",
        "success"
      );

    }


    resetForm();


    /*
     * Nếu đang tìm kiếm thì
     * load lại kết quả.
     */

    const keyword =
      searchInput
        ? normalizePhone(
            searchInput.value
          )
        : "";


    if (keyword) {

      await searchCustomers();

    }


  } catch (error) {

    console.error(
      "Add customer error:",
      error
    );

    showMessage(
      error.message ||
      "Không thể lưu dữ liệu.",
      "error"
    );


  } finally {

    setSaveLoading(false);

  }

}


/* =========================================================
   16. EDIT CUSTOMER
========================================================= */

async function editCustomer(
  id
) {

  if (!supabaseClient) {

    showMessage(
      "Supabase chưa được khởi tạo.",
      "error"
    );

    return;

  }


  if (!id) {

    return;

  }


  try {

    const {
      data,
      error
    } = await supabaseClient

      .from("customers")

      .select("*")

      .eq(
        "id",
        id
      )

      .single();


    if (error) {

      console.error(
        error
      );

      showMessage(
        getSupabaseError(error),
        "error"
      );

      return;

    }


    /*
     * Đổ dữ liệu vào form
     */

    setInputValue(
      "phone",
      data.phone
    );

    setInputValue(
      "customer_name",
      data.customer_name
    );

    setInputValue(
      "shipper_name",
      data.shipper_name
    );

    setInputValue(
      "installer_name",
      data.installer_name
    );

    setInputValue(
      "hamlet",
      data.hamlet
    );

    setInputValue(
      "commune",
      data.commune
    );

    setInputValue(
      "address",
      data.address
    );

    setInputValue(
      "note",
      data.note
    );


    /*
     * Lưu ID đang sửa
     */

    customerForm.dataset.editingId =
      id;


    if (saveButton) {

      saveButton.innerHTML =
        "💾 CẬP NHẬT THÔNG TIN";

    }


    /*
     * Scroll tới form
     */

    const formSection =
      document.querySelector(
        ".add-section"
      );


    if (formSection) {

      formSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }


  } catch (error) {

    console.error(
      error
    );

    showMessage(
      error.message ||
      "Không thể tải thông tin.",
      "error"
    );

  }

}


/* =========================================================
   17. UPDATE CUSTOMER
========================================================= */

async function updateCustomer(
  id
) {

  if (!id) {

    return false;

  }


  const data =
    getFormData();


  const validation =
    validatePhone(
      data.phone
    );


  if (!validation.valid) {

    showMessage(
      validation.message,
      "error"
    );

    return false;

  }


  try {

    const {
      error
    } = await supabaseClient

      .from("customers")

      .update(data)

      .eq(
        "id",
        id
      );


    if (error) {

      console.error(
        error
      );

      showMessage(
        getSupabaseError(error),
        "error"
      );

      return false;

    }


    showMessage(
      "Đã cập nhật thông tin.",
      "success"
    );


    resetForm();


    if (searchInput) {

      const keyword =
        normalizePhone(
          searchInput.value
        );


      if (keyword) {

        await searchCustomers();

      }

    }


    return true;


  } catch (error) {

    console.error(
      error
    );

    showMessage(
      error.message ||
      "Không thể cập nhật.",
      "error"
    );

    return false;

  }

}


/* =========================================================
   18. DELETE CUSTOMER
========================================================= */

async function deleteCustomer(
  id
) {

  if (!supabaseClient) {

    showMessage(
      "Supabase chưa được khởi tạo.",
      "error"
    );

    return;

  }


  if (!id) {

    showMessage(
      "Không xác định được khách hàng.",
      "error"
    );

    return;

  }


  const confirmed =
    confirm(
      "Bạn có chắc muốn xóa thông tin khách hàng này không?"
    );


  if (!confirmed) {

    return;

  }


  try {

    const {
      error
    } = await supabaseClient

      .from("customers")

      .delete()

      .eq(
        "id",
        id
      );


    if (error) {

      console.error(
        "Delete error:",
        error
      );

      showMessage(
        getSupabaseError(error),
        "error"
      );

      return;

    }


    showMessage(
      "Đã xóa khách hàng.",
      "success"
    );


    /*
     * Tìm lại kết quả
     */

    if (searchInput) {

      const keyword =
        normalizePhone(
          searchInput.value
        );


      if (keyword) {

        await searchCustomers();

      } else {

        renderResults([]);

      }

    }


  } catch (error) {

    console.error(
      error
    );

    showMessage(
      error.message ||
      "Không thể xóa khách hàng.",
      "error"
    );

  }

}


/* =========================================================
   19. SET INPUT
========================================================= */

function setInputValue(
  id,
  value
) {

  const element =
    document.getElementById(id);


  if (!element) {

    console.warn(
      "Không tìm thấy:",
      id
    );

    return;

  }


  element.value =
    value ?? "";

}


/* =========================================================
   20. RESET FORM
========================================================= */

function resetForm() {

  if (customerForm) {

    customerForm.reset();

    delete customerForm.dataset.editingId;

  }


  if (saveButton) {

    saveButton.disabled =
      false;

    saveButton.innerHTML =
      "💾 LƯU THÔNG TIN";

  }

}


/*
 * Cho HTML onclick gọi được
 */

window.resetForm =
  resetForm;


/* =========================================================
   21. SUPABASE ERROR
========================================================= */

function getSupabaseError(
  error
) {

  if (!error) {

    return "Không xác định được lỗi.";

  }


  /*
   * RLS policy
   */

  if (
    error.code === "42501" ||
    String(error.message || "")
      .toLowerCase()
      .includes("row-level security")
  ) {

    return `
Supabase đang chặn thao tác do Row Level Security (RLS).

Bạn cần tạo policy cho bảng customers.

Vào:
Supabase → SQL Editor

và chạy policy INSERT / SELECT / UPDATE / DELETE.
    `.trim();

  }


  if (
    error.code === "23505"
  ) {

    return (
      "Số điện thoại này đã tồn tại."
    );

  }


  if (
    error.code === "42P01"
  ) {

    return (
      'Không tìm thấy bảng "customers".'
    );

  }


  return (
    error.message ||
    "Có lỗi xảy ra với Supabase."
  );

}


/* =========================================================
   22. CLEAR SEARCH
========================================================= */

function clearSearchInput() {

  if (!searchInput) {

    return;

  }


  searchInput.value = "";


  renderResults([]);


  if (resultCount) {

    resultCount.textContent =
      "0 kết quả";

  }


  searchInput.focus();

}


/* =========================================================
   23. ENTER SEARCH
========================================================= */

function handleSearchKeydown(
  event
) {

  if (
    event.key === "Enter"
  ) {

    event.preventDefault();

    searchCustomers();

  }

}


/* =========================================================
   24. FORM SUBMIT
========================================================= */

async function handleFormSubmit(
  event
) {

  event.preventDefault();


  if (!supabaseClient) {

    showMessage(
      "Supabase chưa được khởi tạo.",
      "error"
    );

    return;

  }


  /*
   * Nếu đang edit
   */

  const editingId =
    customerForm
      ? customerForm.dataset.editingId
      : "";


  if (editingId) {

    setSaveLoading(true);

    try {

      await updateCustomer(
        editingId
      );

    } finally {

      setSaveLoading(false);

    }

    return;

  }


  /*
   * Nếu thêm mới
   */

  await addCustomer(
    event
  );

}


/* =========================================================
   25. EVENT LISTENERS
========================================================= */

function initEvents() {


  /*
   * Search
   */

  if (searchButton) {

    searchButton.addEventListener(
      "click",
      searchCustomers
    );

  }


  /*
   * Enter
   */

  if (searchInput) {

    searchInput.addEventListener(
      "keydown",
      handleSearchKeydown
    );

  }


  /*
   * Clear
   */

  if (clearSearch) {

    clearSearch.addEventListener(
      "click",
      clearSearchInput
    );

  }


  /*
   * Form
   */

  if (customerForm) {

    customerForm.addEventListener(
      "submit",
      handleFormSubmit
    );

  }


  console.log(
    "Events initialized."
  );

}


/* =========================================================
   26. INITIALIZE APP
========================================================= */

function initApp() {

  console.log(
    "JT Shipper starting..."
  );


  initDOM();


  const supabaseReady =
    initSupabase();


  if (!supabaseReady) {

    renderError(
      "Không thể kết nối Supabase."
    );

    return;

  }


  initEvents();


  console.log(
    "JT Shipper ready."
  );

}


/* =========================================================
   27. START
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initApp
  );

} else {

  initApp();

}


/* =========================================================
   28. GLOBAL FUNCTIONS
========================================================= */

window.searchCustomers =
  searchCustomers;

window.addCustomer =
  addCustomer;

window.updateCustomer =
  updateCustomer;

window.editCustomer =
  editCustomer;

window.deleteCustomer =
  deleteCustomer;

window.escapeHTML =
  escapeHTML;
