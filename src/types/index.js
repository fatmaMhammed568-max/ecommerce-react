// ================= أنواع المستخدم والمصادقة =================

/**
 * @typedef {Object} User
 * @property {number} id - معرف المستخدم
 * @property {string} name - اسم المستخدم
 * @property {string} email - البريد الإلكتروني
 * @property {string} [phone] - رقم الهاتف
 * @property {string} [address] - العنوان
 * @property {number} role - الدور (0: عميل، 1: مسؤول)
 * @property {string} [email_verified_at] - تاريخ تأكيد البريد
 * @property {string} [created_at] - تاريخ الإنشاء
 * @property {string} [updated_at] - تاريخ التحديث
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email - البريد الإلكتروني
 * @property {string} password - كلمة المرور
 * @property {boolean} [remember] - تذكرني
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} name - الاسم
 * @property {string} email - البريد الإلكتروني
 * @property {string} password - كلمة المرور
 * @property {string} password_confirmation - تأكيد كلمة المرور
 * @property {string} [phone] - رقم الهاتف
 * @property {string} [address] - العنوان
 * @property {number} [role] - الدور (للمسؤول فقط)
 */

/**
 * @typedef {Object} AuthResponse
 * @property {boolean} status - حالة العملية
 * @property {string} [message] - رسالة
 * @property {string} token - رمز المصادقة
 * @property {User} user - بيانات المستخدم
 */

/**
 * @typedef {Object} PasswordChangeData
 * @property {string} current_password - كلمة المرور الحالية
 * @property {string} new_password - كلمة المرور الجديدة
 * @property {string} new_password_confirmation - تأكيد كلمة المرور الجديدة
 */

/**
 * @typedef {Object} PasswordResetRequestData
 * @property {string} email - البريد الإلكتروني
 */

/**
 * @typedef {Object} PasswordResetConfirmData
 * @property {string} token - رمز إعادة التعيين
 * @property {string} email - البريد الإلكتروني
 * @property {string} password - كلمة المرور الجديدة
 * @property {string} password_confirmation - تأكيد كلمة المرور
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user - بيانات المستخدم
 * @property {boolean} loading - حالة التحميل
 * @property {boolean} [initialized] - هل تم التهيئة
 * @property {Function} login - دالة تسجيل الدخول
 * @property {Function} register - دالة التسجيل
 * @property {Function} logout - دالة تسجيل الخروج
 * @property {Function} updateUser - دالة تحديث المستخدم
 * @property {Function} [changePassword] - دالة تغيير كلمة المرور
 * @property {Function} [forgotPassword] - دالة نسيت كلمة المرور
 * @property {Function} [resetPassword] - دالة إعادة تعيين كلمة المرور
 * @property {Function} [refreshToken] - دالة تحديث الرمز
 * @property {Function} [verifyToken] - دالة التحقق من الرمز
 * @property {boolean} isAuthenticated - هل المستخدم مسجل دخول
 * @property {boolean} isAdmin - هل المستخدم مسؤول
 */

// ================= أنواع الأقسام =================

/**
 * @typedef {Object} Category
 * @property {number} id - معرف القسم
 * @property {string} name - اسم القسم
 * @property {string} slug - الرابط المختصر
 * @property {string} [note] - ملاحظات
 * @property {string} [description] - الوصف
 * @property {string} [gradient] - التدرج اللوني
 * @property {string} [image] - الصورة
 * @property {string} [image_url] - رابط الصورة
 * @property {number} [user_add_id] - معرف المستخدم المضيف
 * @property {number} [category_id] - معرف القسم الأب
 * @property {string} [created_at] - تاريخ الإنشاء
 * @property {string} [updated_at] - تاريخ التحديث
 * @property {number} [products_count] - عدد المنتجات
 * @property {Category} [parent] - القسم الأب
 * @property {Category[]} [children] - الأقسام الفرعية
 * @property {boolean} [status] - الحالة
 * @property {number} [sort_order] - ترتيب العرض
 */

/**
 * @typedef {Object} CategoryParams
 * @property {string} [search] - نص البحث
 * @property {number} [perPage] - عدد العناصر في الصفحة
 * @property {number} [page] - رقم الصفحة
 * @property {string} [sort] - اتجاه الترتيب
 * @property {string} [sortBy] - الحقل المراد الترتيب به
 * @property {boolean} [status] - الحالة
 * @property {number} [parent_id] - معرف القسم الأب
 */

// ================= أنواع المنتجات =================

/**
 * @typedef {Object} Product
 * @property {number} id - معرف المنتج
 * @property {string} [sku] - رمز المنتج
 * @property {string} name - اسم المنتج
 * @property {string} [slug] - الرابط المختصر
 * @property {string} [description] - الوصف
 * @property {string} [short_description] - وصف مختصر
 * @property {number} price - السعر
 * @property {number} [tax] - الضريبة
 * @property {number} [compare_price] - سعر المقارنة
 * @property {number} [cost_price] - سعر التكلفة
 * @property {number} [weight] - الوزن
 * @property {number} quantity - الكمية
 * @property {number} [min_quantity] - الحد الأدنى للكمية
 * @property {number} [max_quantity] - الحد الأقصى للكمية
 * @property {Object} [dimensions] - الأبعاد
 * @property {string} [main_image] - الصورة الرئيسية
 * @property {string} [main_image_url] - رابط الصورة الرئيسية
 * @property {string} [details] - التفاصيل
 * @property {string} [features] - المميزات
 * @property {number} [category_id] - معرف القسم
 * @property {number} [user_add_id] - معرف المستخدم المضيف
 * @property {number} [brand_id] - معرف الماركة
 * @property {string} [status] - الحالة
 * @property {boolean} [is_featured] - هل هو مميز
 * @property {boolean} [is_new] - هل هو جديد
 * @property {boolean} [on_sale] - هل عليه عرض
 * @property {number} [rating] - التقييم
 * @property {number} [reviews_count] - عدد التقييمات
 * @property {number} [views_count] - عدد المشاهدات
 * @property {number} [sold_count] - عدد المبيعات
 * @property {string} [created_at] - تاريخ الإنشاء
 * @property {string} [updated_at] - تاريخ التحديث
 * @property {string} [deleted_at] - تاريخ الحذف
 * @property {ProductImage[]} [images] - الصور
 * @property {Category} [category] - القسم
 * @property {ProductVariant[]} [variants] - المتغيرات
 * @property {ProductAttribute[]} [attributes] - الخصائص
 * @property {Tag[]} [tags] - الوسوم
 * @property {Brand} [brand] - الماركة
 * @property {ProductSEO} [seo] - تحسين محركات البحث
 */

/**
 * @typedef {Object} ProductImage
 * @property {number} id - معرف الصورة
 * @property {string} url - رابط الصورة
 * @property {string} [alt_text] - النص البديل
 * @property {number} [sort_order] - ترتيب العرض
 * @property {number} [product_id] - معرف المنتج
 */

/**
 * @typedef {Object} ProductAttribute
 * @property {number} id - معرف الخاصية
 * @property {string} name - اسم الخاصية
 * @property {string} value - قيمة الخاصية
 * @property {number} [product_id] - معرف المنتج
 */

/**
 * @typedef {Object} Tag
 * @property {number} id - معرف الوسم
 * @property {string} name - اسم الوسم
 * @property {string} slug - الرابط المختصر
 */

/**
 * @typedef {Object} Brand
 * @property {number} id - معرف الماركة
 * @property {string} name - اسم الماركة
 * @property {string} slug - الرابط المختصر
 * @property {string} [logo] - الشعار
 * @property {string} [description] - الوصف
 */

/**
 * @typedef {Object} ProductSEO
 * @property {string} [meta_title] - عنوان SEO
 * @property {string} [meta_description] - وصف SEO
 * @property {string} [meta_keywords] - كلمات مفتاحية
 * @property {string} [og_image] - صورة المشاركة
 */

/**
 * @typedef {Object} VariantValue
 * @property {number} id - معرف القيمة
 * @property {string} value - القيمة
 * @property {number} [price] - السعر
 * @property {number} [quantity] - الكمية
 * @property {number} [variant_id] - معرف المتغير
 */

/**
 * @typedef {Object} ProductVariant
 * @property {number} id - معرف المتغير
 * @property {string} name - اسم المتغير
 * @property {number} type - نوع المتغير
 * @property {number} product_id - معرف المنتج
 * @property {VariantValue[]} [values] - القيم
 */

// ================= أنواع فلاتر المنتجات =================

/**
 * @typedef {Object} ProductFilters
 * @property {number|string} [category_id] - معرف القسم
 * @property {string} [category_slug] - الرابط المختصر للقسم
 * @property {number|string} [brand_id] - معرف الماركة
 * @property {number} [price_min] - الحد الأدنى للسعر
 * @property {number} [price_max] - الحد الأقصى للسعر
 * @property {string} [sort] - الترتيب
 * @property {string} [search] - نص البحث
 * @property {number} [page] - رقم الصفحة
 * @property {number} [limit] - الحد الأقصى
 * @property {number} [per_page] - عدد العناصر في الصفحة
 * @property {boolean} [in_stock] - متوفر فقط
 * @property {boolean} [on_sale] - عليه عرض
 * @property {boolean} [featured] - مميز
 * @property {Object} [attributes] - الخصائص
 * @property {number} [tag_id] - معرف الوسم
 * @property {string} [status] - الحالة
 */

// ================= أنواع الطلبات =================

/**
 * @typedef {Object} Order
 * @property {number} id - معرف الطلب
 * @property {string} order_number - رقم الطلب
 * @property {number} user_id - معرف المستخدم
 * @property {number} total_amount - المبلغ الإجمالي
 * @property {number} [subtotal] - المجموع الفرعي
 * @property {number} [tax_amount] - قيمة الضريبة
 * @property {number} [discount_amount] - قيمة الخصم
 * @property {number} [shipping_cost] - تكلفة الشحن
 * @property {string} payment_method - طريقة الدفع
 * @property {string} payment_status - حالة الدفع
 * @property {string} status - حالة الطلب
 * @property {string} [payment_receipt] - إيصال الدفع
 * @property {string} [payment_receipt_url] - رابط إيصال الدفع
 * @property {Address|string} [shipping_address] - عنوان الشحن
 * @property {Address|string} [billing_address] - عنوان الفواتير
 * @property {string} [tracking_number] - رقم التتبع
 * @property {string} [tracking_url] - رابط التتبع
 * @property {string} [tracking_company] - شركة الشحن
 * @property {string} [notes] - ملاحظات
 * @property {string} [admin_notes] - ملاحظات المسؤول
 * @property {string} [cancellation_reason] - سبب الإلغاء
 * @property {string} [refund_reason] - سبب الاسترجاع
 * @property {string} [estimated_delivery_date] - تاريخ التوصيل المتوقع
 * @property {string} [actual_delivery_date] - تاريخ التوصيل الفعلي
 * @property {string} [created_at] - تاريخ الإنشاء
 * @property {string} [updated_at] - تاريخ التحديث
 * @property {string} [deleted_at] - تاريخ الحذف
 * @property {User} [user] - المستخدم
 * @property {OrderItem[]} [items] - عناصر الطلب
 * @property {OrderStatusHistory[]} [status_history] - تاريخ الحالات
 */

/**
 * @typedef {Object} OrderItem
 * @property {number} id - معرف العنصر
 * @property {number} order_id - معرف الطلب
 * @property {number} product_id - معرف المنتج
 * @property {string} [product_name] - اسم المنتج
 * @property {string} [product_sku] - رمز المنتج
 * @property {string} [product_image] - صورة المنتج
 * @property {number} quantity - الكمية
 * @property {number} unit_price - سعر الوحدة
 * @property {number} subtotal - المجموع الفرعي
 * @property {number} [discount] - الخصم
 * @property {number} [tax] - الضريبة
 * @property {string} [notes] - ملاحظات
 * @property {Product} [product] - المنتج
 */

/**
 * @typedef {Object} Address
 * @property {string} name - الاسم
 * @property {string} phone - الهاتف
 * @property {string} [email] - البريد الإلكتروني
 * @property {string} address_line1 - العنوان سطر 1
 * @property {string} [address_line2] - العنوان سطر 2
 * @property {string} city - المدينة
 * @property {string} [state] - المنطقة
 * @property {string} [postal_code] - الرمز البريدي
 * @property {string} country - الدولة
 * @property {string} [landmark] - علامة مميزة
 */

/**
 * @typedef {Object} OrderStatusHistory
 * @property {number} id - معرف التاريخ
 * @property {number} order_id - معرف الطلب
 * @property {string} status - الحالة
 * @property {string} [notes] - ملاحظات
 * @property {string} [changed_by] - من قام بالتغيير
 * @property {string} created_at - تاريخ التغيير
 */

/**
 * @typedef {Object} OrderStatusUpdate
 * @property {string} status - الحالة الجديدة
 * @property {string} [notes] - ملاحظات
 * @property {string} [updated_at] - تاريخ التحديث
 */

/**
 * @typedef {Object} OrderTracking
 * @property {string} tracking_number - رقم التتبع
 * @property {string} [tracking_url] - رابط التتبع
 * @property {string} company - الشركة
 * @property {TrackingEvent[]} events - الأحداث
 */

/**
 * @typedef {Object} TrackingEvent
 * @property {string} date - التاريخ
 * @property {string} location - الموقع
 * @property {string} status - الحالة
 * @property {string} [description] - الوصف
 */

/**
 * @typedef {Object} OrderFilters
 * @property {string} [search] - نص البحث
 * @property {string} [status] - الحالة
 * @property {string} [payment_status] - حالة الدفع
 * @property {string} [payment_method] - طريقة الدفع
 * @property {string} [date_from] - من تاريخ
 * @property {string} [date_to] - إلى تاريخ
 * @property {number} [min_amount] - الحد الأدنى للمبلغ
 * @property {number} [max_amount] - الحد الأقصى للمبلغ
 * @property {number} [user_id] - معرف المستخدم
 * @property {number} [per_page] - عدد العناصر في الصفحة
 * @property {number} [page] - رقم الصفحة
 * @property {string} [sort_by] - الترتيب حسب
 * @property {string} [sort_order] - اتجاه الترتيب
 */

// ================= أنواع السلة =================

/**
 * @typedef {Object} CartItem
 * @property {number} id - معرف المنتج
 * @property {string} name - اسم المنتج
 * @property {number} price - السعر
 * @property {number} quantity - الكمية
 * @property {string} [main_image] - الصورة الرئيسية
 */

/**
 * @typedef {Object} CartContextType
 * @property {CartItem[]} cartItems - عناصر السلة
 * @property {number} cartTotal - إجمالي السلة
 * @property {number} cartCount - عدد العناصر
 * @property {boolean} [loading] - حالة التحميل
 * @property {Function} addToCart - دالة إضافة إلى السلة
 * @property {Function} removeFromCart - دالة إزالة من السلة
 * @property {Function} updateQuantity - دالة تحديث الكمية
 * @property {Function} clearCart - دالة إفراغ السلة
 */

/**
 * @typedef {Object} CartServiceResponse
 * @property {boolean} status - حالة العملية
 * @property {string} [message] - رسالة
 * @property {Object} [data] - البيانات
 * @property {CartItem[]} [data.items] - عناصر السلة
 * @property {number} [data.total] - الإجمالي
 */

// ================= أنواع استجابة API =================

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} status - حالة العملية
 * @property {string} [message] - رسالة
 * @property {T} data - البيانات
 * @property {any} [errors] - الأخطاء
 */

/**
 * @template T
 * @typedef {Object} PaginatedResponse
 * @property {T[]} data - البيانات
 * @property {number} current_page - الصفحة الحالية
 * @property {number} last_page - آخر صفحة
 * @property {number} per_page - عدد العناصر في الصفحة
 * @property {number} total - الإجمالي
 * @property {number} [from] - من
 * @property {number} [to] - إلى
 * @property {string} [first_page_url] - رابط الصفحة الأولى
 * @property {string} [last_page_url] - رابط الصفحة الأخيرة
 * @property {string} [next_page_url] - رابط الصفحة التالية
 * @property {string} [prev_page_url] - رابط الصفحة السابقة
 * @property {string} [path] - المسار
 * @property {Array} [links] - روابط الصفحات
 */

// ================= أنواع المفضلة =================

/**
 * @typedef {Object} WishlistItem
 * @property {number} id - معرف المنتج
 * @property {string} name - اسم المنتج
 * @property {number} price - السعر
 * @property {string} [main_image] - الصورة الرئيسية
 * @property {string} [added_at] - تاريخ الإضافة
 */

/**
 * @typedef {Object} WishlistContextType
 * @property {WishlistItem[]} wishlistItems - عناصر المفضلة
 * @property {number} wishlistCount - عدد العناصر
 * @property {boolean} [loading] - حالة التحميل
 * @property {Function} addToWishlist - دالة إضافة إلى المفضلة
 * @property {Function} removeFromWishlist - دالة إزالة من المفضلة
 * @property {Function} isInWishlist - دالة التحقق من الوجود
 * @property {Function} clearWishlist - دالة إفراغ المفضلة
 */

/**
 * @typedef {Object} WishlistServiceResponse
 * @property {boolean} status - حالة العملية
 * @property {string} [message] - رسالة
 * @property {Object} [data] - البيانات
 * @property {WishlistItem[]} [data.items] - عناصر المفضلة
 * @property {number} [data.count] - العدد
 */

// ================= أنواع التقييمات =================

/**
 * @typedef {Object} Review
 * @property {number} id - معرف التقييم
 * @property {number} user_id - معرف المستخدم
 * @property {number} product_id - معرف المنتج
 * @property {number} rating - التقييم
 * @property {string} [comment] - التعليق
 * @property {string[]} [images] - الصور
 * @property {string} status - الحالة
 * @property {string} [created_at] - تاريخ الإنشاء
 * @property {string} [updated_at] - تاريخ التحديث
 * @property {User} [user] - المستخدم
 * @property {Product} [product] - المنتج
 */

/**
 * @typedef {Object} ReviewFilters
 * @property {number} [product_id] - معرف المنتج
 * @property {number} [user_id] - معرف المستخدم
 * @property {number} [rating] - التقييم
 * @property {string} [status] - الحالة
 * @property {number} [page] - رقم الصفحة
 * @property {number} [per_page] - عدد العناصر في الصفحة
 * @property {string} [sort_by] - الترتيب حسب
 * @property {string} [sort_order] - اتجاه الترتيب
 */

/**
 * @typedef {Object} ReviewStats
 * @property {number} average_rating - متوسط التقييم
 * @property {number} total_reviews - إجمالي التقييمات
 * @property {Object} rating_distribution - توزيع التقييمات
 * @property {number} rating_distribution.1 - تقييم 1
 * @property {number} rating_distribution.2 - تقييم 2
 * @property {number} rating_distribution.3 - تقييم 3
 * @property {number} rating_distribution.4 - تقييم 4
 * @property {number} rating_distribution.5 - تقييم 5
 */

// ================= أنواع الكوبونات =================

/**
 * @typedef {Object} Coupon
 * @property {number} id - معرف الكوبون
 * @property {string} code - كود الكوبون
 * @property {string} type - نوع الخصم
 * @property {number} value - قيمة الخصم
 * @property {number} [min_order_amount] - الحد الأدنى للطلب
 * @property {number} [max_discount_amount] - الحد الأقصى للخصم
 * @property {string} [start_date] - تاريخ البداية
 * @property {string} [end_date] - تاريخ النهاية
 * @property {number} [usage_limit] - حد الاستخدام
 * @property {number} [used_count] - عدد مرات الاستخدام
 * @property {number} [per_user_limit] - الحد لكل مستخدم
 * @property {number} [user_id] - معرف المستخدم
 * @property {number[]} [product_ids] - معرفات المنتجات
 * @property {number[]} [category_ids] - معرفات الأقسام
 * @property {number[]} [exclude_product_ids] - المنتجات المستثناة
 * @property {number[]} [exclude_category_ids] - الأقسام المستثناة
 * @property {string} status - الحالة
 * @property {string} [created_at] - تاريخ الإنشاء
 * @property {string} [updated_at] - تاريخ التحديث
 */

/**
 * @typedef {Object} ApplyCouponData
 * @property {string} code - كود الكوبون
 * @property {number} order_total - إجمالي الطلب
 * @property {number[]} [product_ids] - معرفات المنتجات
 * @property {number[]} [category_ids] - معرفات الأقسام
 * @property {number} [user_id] - معرف المستخدم
 */

/**
 * @typedef {Object} CouponValidationResult
 * @property {boolean} valid - صحة الكوبون
 * @property {number} [discount_amount] - قيمة الخصم
 * @property {number} [final_total] - الإجمالي النهائي
 * @property {string} [message] - رسالة
 */

// ================= أنواع الشحن =================

/**
 * @typedef {Object} ShippingMethod
 * @property {number} id - معرف طريقة الشحن
 * @property {string} name - الاسم
 * @property {string} code - الكود
 * @property {string} [description] - الوصف
 * @property {number} price - السعر
 * @property {string} estimated_days - الأيام المتوقعة
 * @property {boolean} [is_free] - هل هو مجاني
 * @property {number} [min_order_for_free] - الحد الأدنى للشحن المجاني
 * @property {string} status - الحالة
 */

/**
 * @typedef {Object} ShippingAddress
 * @property {number} [id] - معرف العنوان
 * @property {number} [user_id] - معرف المستخدم
 * @property {boolean} [is_default] - هل هو افتراضي
 * @property {string} [label] - التصنيف
 */

// ================= أنواع الدفع =================

/**
 * @typedef {Object} PaymentMethod
 * @property {number} id - معرف طريقة الدفع
 * @property {string} name - الاسم
 * @property {string} code - الكود
 * @property {string} [description] - الوصف
 * @property {string} [icon] - الأيقونة
 * @property {string} status - الحالة
 * @property {boolean} [is_cash] - هل هو نقدي
 * @property {boolean} [is_online] - هل هو عبر الإنترنت
 * @property {number} [fees] - الرسوم
 * @property {string} [fees_type] - نوع الرسوم
 */

// ================= أنواع الإشعارات =================

/**
 * @typedef {Object} Notification
 * @property {number} id - معرف الإشعار
 * @property {number} user_id - معرف المستخدم
 * @property {string} title - العنوان
 * @property {string} message - الرسالة
 * @property {string} type - النوع
 * @property {boolean} is_read - هل تمت القراءة
 * @property {any} [data] - بيانات إضافية
 * @property {string} [created_at] - تاريخ الإنشاء
 * @property {string} [read_at] - تاريخ القراءة
 */

/**
 * @typedef {Object} NotificationContextType
 * @property {Notification[]} notifications - الإشعارات
 * @property {number} unreadCount - عدد غير المقروءة
 * @property {boolean} loading - حالة التحميل
 * @property {Function} markAsRead - دالة تحديد كمقروء
 * @property {Function} markAllAsRead - دالة تحديد الكل كمقروء
 * @property {Function} fetchNotifications - دالة جلب الإشعارات
 */

// ================= أنواع البحث =================

/**
 * @typedef {Object} SearchFilters
 * @property {string} query - نص البحث
 * @property {number} [category_id] - معرف القسم
 * @property {number} [brand_id] - معرف الماركة
 * @property {number} [price_min] - الحد الأدنى للسعر
 * @property {number} [price_max] - الحد الأقصى للسعر
 * @property {boolean} [in_stock] - متوفر فقط
 * @property {boolean} [on_sale] - عليه عرض
 * @property {string} [sort] - الترتيب
 * @property {number} [page] - رقم الصفحة
 * @property {number} [per_page] - عدد العناصر في الصفحة
 */

/**
 * @typedef {Object} SearchSuggestion
 * @property {string} type - النوع
 * @property {number} id - المعرف
 * @property {string} text - النص
 * @property {string} [image] - الصورة
 * @property {string} url - الرابط
 */

// ================= أنواع البيانات الثابتة =================

/**
 * @typedef {Object} Country
 * @property {string} code - كود الدولة
 * @property {string} name - اسم الدولة
 * @property {string} phone_code - كود الهاتف
 * @property {string} currency - العملة
 * @property {string} currency_symbol - رمز العملة
 */

/**
 * @typedef {Object} City
 * @property {number} id - معرف المدينة
 * @property {string} name - اسم المدينة
 * @property {string} country_code - كود الدولة
 * @property {number} [shipping_price] - سعر الشحن
 */

// ================= أنواع الأخطاء =================

/**
 * @typedef {Object} ValidationError
 * @property {string} field - الحقل
 * @property {string} message - الرسالة
 */

/**
 * @typedef {Object} ApiError
 * @property {number} status - حالة الخطأ
 * @property {string} message - الرسالة
 * @property {ValidationError[]} [errors] - أخطاء التحقق
 */