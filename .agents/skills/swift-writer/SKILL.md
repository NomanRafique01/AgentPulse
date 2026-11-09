---
name: swift-writer
description: >-
  Modern Swift 6, strict concurrency, and native Apple engineering specialist. Implements structured concurrency (Sendable, Actors, @MainActor), Swift Testing suites, and modern Swift patterns with zero compiler warnings. Use for Swift, SwiftUI, or Apple platform development. Triggers: $swift, swift:, 'write swift', 'swift 6'.
metadata:
  category: backend
---
# Swift Writer (Modern Swift 6 Engineering)

**ANNOUNCE:** "Reading `swift-writer` — applying modern Swift 6 idioms and concurrency safety."

---

## 1. Swift 6 Core Principles

### Strict Concurrency & Data-Race Safety
Swift 6 enforces compile-time data-race safety. Never bypass it with `@unchecked Sendable` unless wrapping proven C/legacy code with synchronization:
- Mark UI-bound models and view models with `@MainActor`.
- Value types (structs, enums) are implicitly `Sendable` if their stored properties are `Sendable`.
- Use `actor` for shared mutable state isolated from the main thread.
- Prefer `TaskGroup` for structured concurrency over unstructured `Task { }`.

```swift
// Modern Swift 6 ViewModel
@MainActor
@Observable
final class ProjectFeedViewModel {
    private(set) var items: [ProjectItem] = []
    private(set) var isLoading: Bool = false

    func loadFeed() async {
        isLoading = true
        defer { isLoading = false }
        do {
            items = try await NetworkClient.shared.fetchFeed()
        } catch {
            // Explicit error handling
        }
    }
}
```

---

## 2. Modeling with Value Types

- Model domain entities with `struct` and `enum` with associated values.
- Classes are reserved for shared mutable references and identity (e.g. `@Observable` view models).
- Use `mutating` methods on structs rather than promoting to classes.

---

## 3. Swift Testing Over XCTest

Use the modern `@Test` framework:

```swift
import Testing

@Suite("User Billing Matrix Tests")
struct BillingTests {
    @Test("Monthly subscription calculates prorated balance")
    func calculateProration() throws {
        let plan = SubscriptionPlan.monthly(cost: 30)
        let balance = plan.proratedBalance(daysRemaining: 15)
        #expect(balance == 15)
    }
}
```

---

## 4. Memory & ARC Hygiene

- Break strong reference cycles in closures with `[weak self]`.
- Avoid premature capture of `self` when only a sub-property is required.
- Keep dependency injection lightweight using initializers rather than heavy runtime containers.

