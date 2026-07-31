# Add Reordering Capabilities to Travel Albums

This plan outlines the addition of position adjustment features for both Travel Albums (Visual Diaries cards) and the photos within those albums.

## Proposed Changes

### 1. Visual Diaries Card Reordering
We will add a new `order` field to the trips in Firestore to track their custom positions.

#### [MODIFY] `src/components/AdminDashboard.jsx`
- Add "Move Left/Up" and "Move Right/Down" arrows to the trip cards in the admin dashboard.
- Implement a function to swap the `order` field of adjacent trips in Firestore when these buttons are clicked.

#### [MODIFY] `src/components/TravelGallery.jsx`
- Update the default sorting logic to sort by the new `order` field (ascending) instead of just the date, ensuring your custom order is respected on the live site.

### 2. Photos Position Adjustment
The photos are stored as an array within the trip document. Changing their position simply means reordering the array before saving.

#### [MODIFY] `src/components/TripEditor.jsx`
- Add "Move Left" and "Move Right" buttons to the uploaded photo thumbnails.
- Implement logic to swap a photo with its neighbor in the array when clicked.
- This will allow you to precisely organize the order of photos in an album before hitting "Save Trip".

## Verification Plan

### Manual Verification
- Go to `/admin`, select "Travel Albums", and use the arrows to reorder the trips. Verify that the changes reflect on the homepage.
- Open a trip, add photos, and use the arrows to change the photo order. Save the trip and verify the order is updated on the live site.
