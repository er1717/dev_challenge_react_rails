class ProductsController < ApplicationController
  before_action :set_product, only: [:update, :destroy]

  def index
    result = [];
    required = [:length, :width, :height, :weight]
    
    if params.has_value? "0"
      result = {error: "Sorry, minimum input value is 1"}
    elsif required.all? { |k, v| params.has_key? k}
      list = Product.where(:length.gte => params[:length], :width.gte => params[:width], :height.gte => params[:height], :weight.gte => params[:weight])
      result = list.map do |product|
        match_score = (product.length - params[:length].to_i).abs() + (product.width - params[:width].to_i).abs() + (product.height - params[:height].to_i).abs() + (product.weight - params[:weight].to_i).abs()
        {product: product, score: match_score}
      end.sort_by { |item| item[:score]}.first
      result = result[:product] if result
      result = {error: "No matching products"} unless result
    elsif required.any? { |k| params.has_key? k}
      result = {error: "One or more of these required fields are missing #{required}"}
    else
      result = Product.all
    end
    render json: result    
  end

  def create
    @product = Product.new(product_params)    
    if @product.save
      render json: @product, status: :created
    else
      render json: { errors: @product.errors, status: :unprocessable_entity }
    end
  end
  
  def update
    if @product
      if @product.update(product_params)
        render json: @product
      else
        render json: @product.errors, status: :unprocessable_entity
      end
    else
      render json: { error: "Product not found" }, status: 401
    end
  end

  def destroy
    if @product
      @product.destroy
      render json: {success: "#{@product.id} has been deleted"}
    else
      render json: { error: "Product not found" }, status: 422
    end
  end  

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def product_params
      params.require(:product).permit(:name, :type, :length, :width, :height, :weight)
    end
end
