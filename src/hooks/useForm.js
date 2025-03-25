import { useState, useCallback } from 'react'

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation functions
  const validateField = useCallback((name, value) => {
    const rules = validationRules[name]
    if (!rules) return ''

    for (const rule of rules) {
      if (typeof rule === 'function') {
        const error = rule(value)
        if (error) return error
      } else if (rule.required && !value) {
        return rule.message || 'This field is required'
      } else if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || 'Invalid format'
      } else if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `Minimum ${rule.minLength} characters required`
      } else if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `Maximum ${rule.maxLength} characters allowed`
      }
    }
    return ''
  }, [validationRules])

  const validateForm = useCallback(() => {
    const newErrors = {}
    Object.keys(values).forEach(name => {
      const error = validateField(name, values[name])
      if (error) newErrors[name] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values, validateField])

  // Form handlers
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value

    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }))

    if (touched[name]) {
      const error = validateField(name, fieldValue)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }, [touched, validateField])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    const error = validateField(name, values[name])
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }, [values, validateField])

  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true)
    try {
      if (validateForm()) {
        await onSubmit(values)
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validateForm])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  // Field-level helpers
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] ? errors[name] : undefined
  }), [values, touched, errors, handleChange, handleBlur])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    getFieldProps,
    validateField,
    validateForm
  }
}

// Validation rules
export const validationRules = {
  required: (message = 'This field is required') => ({
    required: true,
    message
  }),
  email: (message = 'Invalid email address') => ({
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message
  }),
  minLength: (length, message) => ({
    minLength: length,
    message: message || `Minimum ${length} characters required`
  }),
  maxLength: (length, message) => ({
    maxLength: length,
    message: message || `Maximum ${length} characters allowed`
  }),
  pattern: (pattern, message) => ({
    pattern,
    message
  })
} 