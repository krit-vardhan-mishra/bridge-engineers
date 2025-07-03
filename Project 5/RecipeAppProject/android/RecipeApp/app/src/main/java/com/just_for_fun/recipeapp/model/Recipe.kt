package com.just_for_fun.recipeapp.model

import android.os.Parcel
import android.os.Parcelable
import com.just_for_fun.recipeapp.R

data class Recipe(
    val id: Int,
    val name: String,
    val image: Int,
    val cookingTime: String,
    val difficulty: String,
    val rating: Float,
    val description: String = "",
    val ingredients: List<String> = emptyList(),
    val instructions: List<String> = emptyList(),
    val servings: Int = 1,
    var isSaved: Boolean = false,
    val savedDate: String? = null,
    val createdDate: String = ""
) : Parcelable {

    constructor(parcel: Parcel) : this(
        parcel.readInt(),
        parcel.readString()!!,
        parcel.readInt(),
        parcel.readString()!!,
        parcel.readString()!!,
        parcel.readFloat(),
        parcel.readString()!!,
        parcel.createStringArrayList()!!,
        parcel.createStringArrayList()!!,
        parcel.readInt(),
        parcel.readByte() != 0.toByte(),
        parcel.readString(),
        parcel.readString()!!
    )

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeInt(id)
        parcel.writeString(name)
        parcel.writeInt(image)
        parcel.writeString(cookingTime)
        parcel.writeString(difficulty)
        parcel.writeFloat(rating)
        parcel.writeString(description)
        parcel.writeStringList(ingredients)
        parcel.writeStringList(instructions)
        parcel.writeInt(servings)
        parcel.writeByte(if (isSaved) 1 else 0)
        parcel.writeString(savedDate)
        parcel.writeString(createdDate)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<Recipe> {
        override fun createFromParcel(parcel: Parcel): Recipe {
            return Recipe(parcel)
        }

        override fun newArray(size: Int): Array<Recipe?> {
            return arrayOfNulls(size)
        }

        // Sample recipes for demonstration
        fun getSampleRecipes(): List<Recipe> {
            return listOf(
                Recipe(
                    id = 1,
                    name = "Chocolate Lava Cake",
                    image = R.drawable.lava_cake,
                    cookingTime = "25 min",
                    difficulty = "Medium",
                    rating = 4.8f,
                    description = "Decadent chocolate cake with molten center that melts in your mouth. Perfect for a quick dessert.",
                    ingredients = listOf(
                        "200g dark chocolate",
                        "100g unsalted butter",
                        "2 large eggs",
                        "50g granulated sugar",
                        "30g all-purpose flour",
                        "Pinch of salt"
                    ),
                    instructions = listOf(
                        "Preheat oven to 200°C (400°F). Grease and flour two ramekins.",
                        "Melt chocolate and butter in a heatproof bowl set over a saucepan of simmering water (double boiler) or in the microwave, stirring until smooth.",
                        "In a separate bowl, whisk eggs and sugar until light and fluffy.",
                        "Fold the melted chocolate mixture into the egg mixture.",
                        "Gently fold in the flour and a pinch of salt until just combined. Do not overmix.",
                        "Pour the batter evenly into the prepared ramekins.",
                        "Bake for 12-14 minutes, or until the edges are set but the center is still soft and gooey.",
                        "Carefully invert onto plates and serve immediately with a scoop of ice cream or fresh berries."
                    ),
                    servings = 2,
                    savedDate = "Dec 25, 2024",
                    createdDate = "Dec 20, 2024"
                ),
                Recipe(
                    id = 2,
                    name = "Margherita Pizza",
                    image = R.drawable.pizza,
                    cookingTime = "45 min",
                    difficulty = "Easy",
                    rating = 4.6f,
                    description = "A classic Neapolitan pizza, simple yet incredibly flavorful. Made with fresh tomatoes, mozzarella, basil, and a drizzle of olive oil.",
                    ingredients = listOf(
                        "1 pre-made pizza dough or homemade",
                        "1/2 cup tomato sauce",
                        "150g fresh mozzarella, sliced or torn",
                        "Fresh basil leaves",
                        "2 tbsp olive oil",
                        "Pinch of salt"
                    ),
                    instructions = listOf(
                        "Preheat your oven to the highest temperature (usually 220-250°C or 450-500°F) with a pizza stone or baking steel inside if you have one.",
                        "Stretch or roll out your pizza dough on a lightly floured surface to your desired thickness.",
                        "Transfer the dough to a parchment-lined pizza peel or baking sheet.",
                        "Spread the tomato sauce evenly over the dough, leaving a small border for the crust.",
                        "Arrange the mozzarella slices or torn pieces over the sauce.",
                        "Drizzle with a tablespoon of olive oil and sprinkle with a pinch of salt.",
                        "Carefully transfer the pizza to the hot oven (or baking stone/steel).",
                        "Bake for 8-15 minutes, depending on your oven and desired crispness, until the crust is golden and the cheese is bubbly and slightly browned.",
                        "Remove from oven, scatter fresh basil leaves over the hot pizza, and drizzle with the remaining olive oil before slicing and serving."
                    ),
                    servings = 4,
                    savedDate = "Dec 25, 2024",
                    createdDate = "Dec 18, 2024"
                ),
                Recipe(
                    id = 3,
                    name = "Chicken Curry",
                    image = R.drawable.curry,
                    cookingTime = "60 min",
                    difficulty = "Hard",
                    rating = 4.9f,
                    description = "A rich and aromatic chicken curry, perfect for a cozy dinner. Packed with traditional Indian spices and creamy coconut milk.",
                    ingredients = listOf(
                        "500g chicken breast or thigh, cubed",
                        "1 large onion, chopped",
                        "2 tomatoes, pureed",
                        "1 cup coconut milk",
                        "2 tbsp ginger-garlic paste",
                        "1 tbsp curry powder",
                        "1 tsp turmeric powder",
                        "1 tsp cumin powder",
                        "1 tsp coriander powder",
                        "Fresh cilantro for garnish",
                        "Salt to taste",
                        "Oil for cooking"
                    ),
                    instructions = listOf(
                        "Heat oil in a large pot or Dutch oven over medium heat. Add chopped onions and sauté until golden brown.",
                        "Add ginger-garlic paste and cook for 1-2 minutes until fragrant.",
                        "Stir in turmeric, cumin, coriander, and curry powder. Cook for another minute, stirring constantly, to toast the spices.",
                        "Add the cubed chicken and cook until lightly browned on all sides.",
                        "Pour in the tomato puree and cook for 5-7 minutes, stirring occasionally, until the sauce thickens and oil separates from the sides.",
                        "Stir in the coconut milk and bring to a gentle simmer. Reduce heat to low, cover, and let it cook for 20-25 minutes, or until chicken is cooked through and tender.",
                        "Season with salt to taste.",
                        "Garnish with fresh cilantro before serving hot with rice or naan bread."
                    ),
                    servings = 6,
                    savedDate = "Dec 25, 2024",
                    createdDate = "Dec 15, 2024"
                ),
                Recipe(
                    id = 4,
                    name = "Caesar Salad",
                    image = R.drawable.salad,
                    cookingTime = "15 min",
                    difficulty = "Easy",
                    rating = 4.3f,
                    description = "A refreshing and crisp Caesar salad with homemade dressing and crunchy croutons. A perfect light meal or side dish.",
                    ingredients = listOf(
                        "1 head romaine lettuce, chopped",
                        "1 cup croutons",
                        "1/2 cup grated Parmesan cheese",
                        "For the dressing:",
                        "1 egg yolk",
                        "1 clove garlic, minced",
                        "1 tsp Dijon mustard",
                        "1 tbsp lemon juice",
                        "1/2 cup olive oil",
                        "Salt and black pepper to taste"
                    ),
                    instructions = listOf(
                        "To make the dressing: In a small bowl, whisk together the egg yolk, minced garlic, Dijon mustard, and lemon juice.",
                        "Slowly drizzle in the olive oil while continuously whisking until the dressing emulsifies and thickens.",
                        "Season the dressing with salt and black pepper to taste.",
                        "In a large bowl, combine the chopped romaine lettuce, croutons, and grated Parmesan cheese.",
                        "Pour the dressing over the salad ingredients.",
                        "Toss gently to ensure all the lettuce and croutons are coated with the dressing.",
                        "Serve immediately as a side or a light meal."
                    ),
                    servings = 2,
                    savedDate = "Dec 25, 2024",
                    createdDate = "Dec 22, 2024"
                ),
                Recipe(
                    id = 5,
                    name = "Pasta Carbonara",
                    image = R.drawable.pasta_carbonara,
                    cookingTime = "25 mins",
                    difficulty = "Easy",
                    rating = 4.5f,
                    description = "Classic Italian pasta dish with eggs, cheese, pancetta, and pepper.",
                    ingredients = listOf(
                        "200g spaghetti",
                        "2 large eggs",
                        "50g Pecorino Romano cheese, grated",
                        "100g pancetta, diced",
                        "Black pepper to taste",
                        "Salt to taste"
                    ),
                    instructions = listOf(
                        "Cook the spaghetti in salted boiling water until al dente. Reserve 1/4 cup of the pasta water.",
                        "Fry the pancetta in a skillet until crispy, then remove from heat.",
                        "In a bowl, whisk together eggs and grated cheese.",
                        "Quickly mix the drained hot pasta with the pancetta.",
                        "Add the egg-cheese mixture, tossing quickly to coat and create a creamy sauce.",
                        "Use reserved pasta water to loosen the sauce if needed.",
                        "Season with freshly cracked black pepper and serve immediately."
                    ),
                    servings = 4,
                    savedDate = "Dec 25, 2024",
                    createdDate = "2023-10-25"
                ),
                Recipe(
                    id = 6,
                    name = "Beef Steak",
                    image = R.drawable.beef_steak,
                    cookingTime = "15 mins",
                    difficulty = "Medium",
                    rating = 4.9f,
                    description = "Perfectly seared beef steak, juicy and flavorful.",
                    ingredients = listOf(
                        "1 beef steak (ribeye or sirloin)",
                        "Salt and pepper to taste",
                        "1 tbsp olive oil",
                        "2 cloves garlic, crushed",
                        "1 sprig rosemary or thyme",
                        "1 tbsp butter"
                    ),
                    instructions = listOf(
                        "Take the steak out of the fridge 30 minutes before cooking and season with salt and pepper.",
                        "Heat a skillet until very hot, then add olive oil.",
                        "Sear the steak for 2–3 minutes on each side for medium-rare, or adjust to desired doneness.",
                        "Add butter, garlic, and herbs to the pan and baste the steak for 1–2 minutes.",
                        "Let the steak rest for 5 minutes before slicing and serving."
                    ),
                    servings = 1,
                    savedDate = "Dec 25, 2024",
                    createdDate = "2023-10-23"
                ),
                Recipe(
                    id = 7,
                    name = "Fish Tacos",
                    image = R.drawable.fish_tacos,
                    cookingTime = "35 mins",
                    difficulty = "Easy",
                    rating = 4.7f,
                    description = "Delicious and fresh fish tacos with a zesty slaw.",
                    ingredients = listOf(
                        "300g white fish fillets (cod or tilapia)",
                        "1 tsp chili powder",
                        "1/2 tsp cumin",
                        "Salt and pepper to taste",
                        "1 tbsp olive oil",
                        "1 cup shredded cabbage",
                        "1/4 cup sour cream",
                        "1 tbsp lime juice",
                        "Fresh cilantro, chopped",
                        "6 corn tortillas"
                    ),
                    instructions = listOf(
                        "Season the fish with chili powder, cumin, salt, and pepper.",
                        "Heat olive oil in a pan and cook the fish for 3–4 minutes per side until flaky. Set aside.",
                        "In a bowl, mix cabbage with sour cream, lime juice, and cilantro to make slaw.",
                        "Warm the corn tortillas in a dry skillet or microwave.",
                        "Assemble tacos with pieces of fish and slaw. Serve immediately with extra lime wedges."
                    ),
                    servings = 3,
                    savedDate = "Dec 25, 2024",
                    createdDate = "2023-10-21"
                )
            )
        }
    }
}